import type {
  CollectionMetaData,
  Icon,
  MetaItem,
} from "../../../../types/data";
import type { AllKeysOf, Blend } from "../../../../types/utilities";
import { splitObject } from "../../../../utils/objects";
import type { I18nContext } from "../../../i18n";
import type { PreviewableCollectionKey, PreviewableEntry } from "../../types";
import type { TransformEntryConfig } from "../types";

type MetaData = Blend<CollectionMetaData>;
type CollectionMetaIcon = Partial<Record<AllKeysOf<MetaData>, Icon>>;

const hasValue = <K extends keyof MetaData>(
  value: MetaData[K]
): value is NonNullable<MetaData[K]> => {
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Some MetaData fields can be null, so we need `=== null`. */
  if (value === undefined || value === null) return false;
  return Array.isArray(value) ? value.length > 0 : true;
};

export type MetaTransformConfig = {
  i18n: Omit<I18nContext, "locale">;
  icons?: CollectionMetaIcon | null | undefined;
  showAuthorsIfAvailable?: boolean | null | undefined;
};

const transformKind = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.kind)) return null;

  return {
    label: translate("meta.label.project.kind"),
    values: [translate(`meta.value.project.kind.${data.kind}`)],
    icon: icons?.kind,
  };
};

const transformPublishedOn = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.publishedOn)) return null;

  return {
    label: translate("meta.label.published.on"),
    values: [data.publishedOn],
    icon: icons?.publishedOn,
  };
};

const transformUpdatedOn = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.updatedOn) || data.publishedOn === undefined) return null;
  if (data.updatedOn.toISOString() === data.publishedOn.toISOString()) {
    return null;
  }

  return {
    label: translate("meta.label.last.update"),
    values: [data.updatedOn],
    icon: icons?.updatedOn,
  };
};

const transformAuthors = (
  data: MetaData,
  {
    icons,
    i18n: { translatePlural },
    showAuthorsIfAvailable,
  }: MetaTransformConfig
): MetaItem | null => {
  if (showAuthorsIfAvailable === false || !hasValue(data.authors)) return null;

  const values = data.authors.map(({ isWebsiteOwner, name, website }) =>
    website !== undefined && !isWebsiteOwner
      ? { label: name, path: website }
      : name
  );

  return {
    label: translatePlural("meta.label.authors", {
      count: values.length,
    }),
    values,
    icon: icons?.authors,
  };
};

const transformInLanguage = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.inLanguage)) return null;

  return {
    label: translate("meta.label.language"),
    values: [translate(`language.name.${data.inLanguage}`)],
    icon: icons?.inLanguage,
  };
};

const transformInLanguages = (
  data: MetaData,
  { icons, i18n }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.inLanguages)) return null;

  const values = data.inLanguages.map((lang) =>
    i18n.translate(`language.name.${lang}`)
  );

  return {
    label: i18n.translatePlural("meta.label.languages", {
      count: values.length,
    }),
    values,
    icon: icons?.inLanguages,
  };
};

const transformReadingTime = (
  data: MetaData,
  { icons, i18n: { translate, translatePlural } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.readingTime)) return null;

  return {
    label: translate("meta.label.reading.time"),
    values: [
      translatePlural("meta.value.reading.time.in.minutes", {
        count: data.readingTime.inMinutes,
      }),
    ],
    description: translate("meta.description.reading.time", {
      ...data.readingTime.inMinutesAndSeconds,
      speed: data.readingTime.wordsPerMinute,
      words: data.readingTime.wordsCount,
    }),
    icon: icons?.readingTime,
  };
};

const transformIsArchived = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.isArchived)) return null;
  if (!data.isArchived) return null;

  return {
    label: translate("meta.label.status"),
    values: [translate("meta.value.status.archived")],
    icon: icons?.isArchived,
  };
};

const transformRepository = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.repository)) return null;

  return {
    label: translate("meta.label.repository"),
    values: [{ label: data.repository.name, path: data.repository.url }],
    icon: icons?.repository,
  };
};

const transformCategory = (
  data: MetaData,
  { icons, i18n: { translate } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.category)) return null;

  return {
    label: translate("meta.label.category"),
    values: [data.category],
    icon: icons?.category,
  };
};

const transformTags = (
  data: MetaData,
  { icons, i18n: { translatePlural } }: MetaTransformConfig
): MetaItem | null => {
  if (!hasValue(data.tags)) return null;

  return {
    label: translatePlural("meta.label.tags", { count: data.tags.length }),
    values: data.tags,
    icon: icons?.tags,
  };
};

/**
 * Transforms the given collections entries meta to valid meta items.
 *
 * @param {MetaData} data - The data to transform.
 * @param {MetaTransformConfig} config - The i18n context & optional icons.
 * @returns {MetaItem[]} The transformed metadata.
 */
export const convertCollectionMetaToMetaItem = (
  data: MetaData,
  config: MetaTransformConfig
): MetaItem[] => {
  const transformers = [
    transformKind,
    transformPublishedOn,
    transformUpdatedOn,
    transformAuthors,
    transformInLanguage,
    transformInLanguages,
    transformReadingTime,
    transformIsArchived,
    transformRepository,
    transformCategory,
    transformTags,
  ];

  return transformers
    .map((transformer) => transformer(data, config))
    .filter((item): item is MetaItem => item !== null);
};

type TransformMetaConfig<T extends PreviewableCollectionKey> = Pick<
  TransformEntryConfig<T>,
  "featuredMetaItem" | "i18n" | "showAuthorsIfAvailable"
> & {
  showMeta: boolean | null | undefined;
};

type TransformMetaResult = {
  featuredMeta: MetaItem | null;
  meta: MetaItem[] | null;
};

/**
 * Transform entry metadata, optionally extracting a featured meta item.
 *
 * @template T The collection key.
 * @param {PreviewableEntry<T>["meta"]} entryMeta - The entry's metadata object.
 * @param {TransformMetaConfig<T>} config - Configuration for transformation.
 * @returns {TransformMetaResult} Object with featured and remaining meta items.
 */
export const transformEntryMeta = <
  E extends PreviewableEntry,
  T extends PreviewableCollectionKey = E["collection"],
>(
  { meta: entryMeta }: E,
  {
    featuredMetaItem,
    i18n,
    showAuthorsIfAvailable,
    showMeta,
  }: TransformMetaConfig<T>
): TransformMetaResult => {
  const { extracted, remaining } =
    featuredMetaItem?.key === undefined
      ? { remaining: entryMeta }
      : splitObject(entryMeta, featuredMetaItem.key);

  const [featuredMeta = null] =
    extracted === undefined
      ? []
      : convertCollectionMetaToMetaItem(extracted, {
          i18n,
          showAuthorsIfAvailable,
        }).map((m): MetaItem => {
          return {
            ...m,
            icon: featuredMetaItem?.icon
              ? { name: featuredMetaItem.icon }
              : null,
          };
        });

  const meta =
    showMeta === true
      ? convertCollectionMetaToMetaItem(remaining, {
          i18n,
          showAuthorsIfAvailable,
        })
      : null;

  return { featuredMeta, meta };
};

/**
 * Update an entry by removing the category from the meta when the route
 * matches.
 *
 * @template T The collection key.
 * @param {PreviewableEntry<T>} entry - The entry to update.
 * @param {string} route - The category route to check.
 * @returns {PreviewableEntry<T>} The updated entry.
 */
export const removeCategoryByRoute = <T extends PreviewableCollectionKey>(
  entry: PreviewableEntry<T>,
  route: string
): PreviewableEntry<T> => {
  return {
    ...entry,
    meta: {
      ...entry.meta,
      ...("category" in entry.meta
        ? {
            category:
              route === entry.meta.category?.path ? null : entry.meta.category,
          }
        : {}),
    },
  };
};

/**
 * Update an entry by removing a tag from the meta when the route
 * matches.
 *
 * @template T The collection key.
 * @param {PreviewableEntry<T>} entry - The entry to update.
 * @param {string} route - The tag route to check.
 * @returns {PreviewableEntry<T>} The updated entry.
 */
export const removeTagByRoute = <T extends PreviewableCollectionKey>(
  entry: PreviewableEntry<T>,
  route: string
): PreviewableEntry<T> => {
  return {
    ...entry,
    meta: {
      ...entry.meta,
      ...("tags" in entry.meta
        ? {
            tags: entry.meta.tags?.filter((tag) => tag.path !== route),
          }
        : {}),
    },
  };
};
