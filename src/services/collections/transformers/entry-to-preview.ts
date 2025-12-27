import type { EntryPreview } from "../../../types/data";
import type { IconName } from "../../../types/tokens";
import type { AllKeysOf } from "../../../types/utilities";
import type { I18nContext } from "../../i18n";
import { useRouting } from "../../routing";
import type { ListingPageCollection } from "../pageable-entries";
import type { QueriedCollectionEntry } from "../query-collection";
import type {
  PreviewableCollectionKey,
  PreviewableEntry,
  QueriedEntry,
} from "../types";
import { removeCategoryByRoute, removeTagByRoute } from "./helpers";
import {
  convertBlogPostToPreview,
  convertBlogToPreview,
  convertBookmarkToPreview,
  convertGuideToPreview,
  convertNoteToPreview,
  convertPageToPreview,
  convertProjectToPreview,
  convertTaxonomyToPreview,
} from "./single-collection-entry";

type FeaturedMetaItem<
  T extends PreviewableCollectionKey = PreviewableCollectionKey,
> = {
  key: AllKeysOf<PreviewableEntry<T>["meta"]>;
  icon: IconName;
};

type EntryTransformConfig<
  T extends PreviewableCollectionKey = PreviewableCollectionKey,
> = {
  featuredMetaItem?: FeaturedMetaItem<T> | null | undefined;
  i18n: Omit<I18nContext, "locale">;
  isQuote?: boolean | null | undefined;
  locale?: string | null | undefined;
  showAuthorsIfAvailable?: boolean | null | undefined;
  showCover?: boolean | null | undefined;
  showCta?: boolean | null | undefined;
  showMeta?: boolean | null | undefined;
};

/**
 * Convert a collection entry to a format suitable for PreviewCard.
 *
 * This function acts as a dispatcher, routing entries to their specific
 * converter based on the collection type.
 *
 * @template T The previewable collection key.
 * @param {QueriedEntry} entry - The collection entry to convert.
 * @param {EntryTransformConfig<T>} config - The transformation config.
 * @returns {EntryPreview} The converted entry preview.
 * @throws When a collection is unsupported.
 */
const convertEntryToPreview = <
  T extends PreviewableCollectionKey = PreviewableCollectionKey,
>(
  entry: PreviewableEntry<T>,
  config: EntryTransformConfig<T>
): EntryPreview => {
  /* Unfortunately we need some casts here because Typescript is not able to
   * narrow down the `config` type in the switch statement. */
  switch (entry.collection) {
    case "blog.categories":
    case "tags":
      return convertTaxonomyToPreview(
        entry,
        config as EntryTransformConfig<"blog.categories" | "tags">
      );
    case "blog.posts":
      return convertBlogPostToPreview(
        entry,
        config as EntryTransformConfig<"blog.posts">
      );
    case "index.pages":
    case "pages":
      return convertPageToPreview(
        entry,
        config as EntryTransformConfig<"index.pages" | "pages">
      );
    case "blogroll":
      return convertBlogToPreview(
        entry,
        config as EntryTransformConfig<"blogroll">
      );
    case "bookmarks":
      return convertBookmarkToPreview(
        entry,
        config as EntryTransformConfig<"bookmarks">
      );
    case "guides":
      return convertGuideToPreview(
        entry,
        config as EntryTransformConfig<"guides">
      );
    case "notes":
      return convertNoteToPreview(
        entry,
        config as EntryTransformConfig<"notes">
      );
    case "projects":
      return convertProjectToPreview(
        entry,
        config as EntryTransformConfig<"projects">
      );
    default:
      throw new Error(`Unsupported collection.`);
  }
};

type CollectionMetaKeys = {
  [K in PreviewableCollectionKey]: keyof NonNullable<
    QueriedEntry<K, "preview">["meta"]
  >;
};

type MixedFeaturedMetaValue = Record<
  PreviewableCollectionKey,
  {
    icon: IconName;
    value: string;
  }
>;
type SingleFeaturedMetaConfig = {
  [K in PreviewableCollectionKey]: {
    key: CollectionMetaKeys[K];
    icon: IconName;
  } | null;
};

const isTaxonomyEntry = (collection: PreviewableCollectionKey) =>
  collection === "blog.categories" || collection === "tags";

const getCollectionsFeaturedMeta = ({
  translate,
}: Pick<I18nContext, "translate">): MixedFeaturedMetaValue => {
  return {
    "blog.categories": {
      icon: "tag",
      value: translate("meta.value.content.kind.blog.category"),
    },
    "blog.posts": {
      icon: "blog",
      value: translate("meta.value.content.kind.blog.post"),
    },
    blogroll: {
      icon: "globe",
      value: translate("meta.value.content.kind.blogroll"),
    },
    bookmarks: {
      icon: "bookmark",
      value: translate("meta.value.content.kind.bookmark"),
    },
    guides: {
      icon: "guide",
      value: translate("meta.value.content.kind.guide"),
    },
    "index.pages": {
      icon: "page",
      value: translate("meta.value.content.kind.page"),
    },
    notes: {
      icon: "notepad",
      value: translate("meta.value.content.kind.note"),
    },
    pages: {
      icon: "page",
      value: translate("meta.value.content.kind.page"),
    },
    projects: {
      icon: "project",
      value: translate("meta.value.content.kind.project"),
    },
    tags: {
      icon: "tag",
      value: translate("meta.value.content.kind.tag"),
    },
  };
};

const getFeaturedMetaPerCollection = (): SingleFeaturedMetaConfig => {
  return {
    "blog.categories": null,
    "blog.posts": {
      icon: "blog",
      key: "publishedOn",
    },
    blogroll: {
      icon: "locale",
      key: "inLanguages",
    },
    bookmarks: {
      icon: "locale",
      key: "inLanguage",
    },
    guides: {
      icon: "guide",
      key: "publishedOn",
    },
    "index.pages": {
      icon: "page",
      key: "publishedOn",
    },
    notes: {
      icon: "notepad",
      key: "publishedOn",
    },
    pages: {
      icon: "page",
      key: "publishedOn",
    },
    projects: {
      icon: "project",
      key: "kind",
    },
    tags: null,
  };
};

type ConfigureEntryOptions = {
  currentRoute: string;
  i18n: I18nContext;
  showAuthorsIfAvailable?: boolean | null | undefined;
  showCollectionLabel?: boolean | null | undefined;
};

/**
 * Convert a collection entry to a preview format with display context.
 *
 * This function prepares collection entries for display in listing pages by:
 * - Filtering out the current taxonomy (tag/category) from entry metadata when viewing that taxonomy's page
 * - Configuring featured metadata
 * - Applying collection-specific display settings (covers, CTAs, metadata visibility).
 *
 * @param {QueriedCollectionEntry<ListingPageCollection, "preview">} entry - The collection entry to convert.
 * @param {ConfigureEntryOptions} options - Configuration options.
 * @returns {Promise<EntryPreview>} The converted entry ready for display in a PreviewCard.
 */
export const convertToPreview = async (
  entry: QueriedCollectionEntry<ListingPageCollection, "preview">,
  {
    currentRoute,
    i18n,
    showAuthorsIfAvailable,
    showCollectionLabel = false,
  }: ConfigureEntryOptions
): Promise<EntryPreview> => {
  const { routeById } = await useRouting(i18n.locale);
  const isCategoryPage = currentRoute.startsWith(
    routeById("blog/categories").path
  );
  const isTagPage = currentRoute.startsWith(routeById("tags").path);
  const entryWithUpdatedCat = isCategoryPage
    ? removeCategoryByRoute(entry, currentRoute)
    : entry;
  const updatedEntry = isTagPage
    ? removeTagByRoute(entryWithUpdatedCat, currentRoute)
    : entryWithUpdatedCat;

  const mixedFeaturedMetaValue = getCollectionsFeaturedMeta(i18n);
  const singleFeaturedMetaConfig = getFeaturedMetaPerCollection();
  const previewEntry = convertEntryToPreview(updatedEntry, {
    featuredMetaItem:
      showCollectionLabel === true
        ? null
        : singleFeaturedMetaConfig[entry.collection],
    i18n,
    isQuote: entry.collection === "bookmarks" && entry.isQuote,
    locale:
      entry.collection === "bookmarks" && entry.isQuote
        ? entry.meta.inLanguage
        : null,
    showAuthorsIfAvailable,
    showCover: true,
    showCta: !isTaxonomyEntry(entry.collection),
    showMeta: !isTaxonomyEntry(entry.collection),
  });

  return showCollectionLabel === true
    ? {
        ...previewEntry,
        featuredMeta: {
          icon: {
            name: mixedFeaturedMetaValue[entry.collection].icon,
          },
          label: i18n.translate("meta.label.collection"),
          values: [mixedFeaturedMetaValue[entry.collection].value],
        },
      }
    : previewEntry;
};
