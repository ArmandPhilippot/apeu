import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import type { Order } from "../../../types/tokens";
import type {
  CollectionReference,
  HasNestedKey,
  KeyOfType,
  LooseAutocomplete,
  SharedShape,
} from "../../../types/utilities";
import type { AvailableLanguage } from "../../../utils/i18n";
import { sortByKey } from "../../../utils/sort";
import { isObject } from "../../../utils/type-checks";
import { formatEntry, type EntryFormat } from "./format-entry";

type QueryCollectionOrderBy<C extends CollectionKey> = {
  /**
   * The key used to order the entries.
   */
  key: CollectionEntry<C>["data"] extends Record<"meta", unknown>
    ?
        | KeyOfType<CollectionEntry<C>["data"]["meta"], string | Date>
        | KeyOfType<CollectionEntry<C>["data"], string | Date>
    : KeyOfType<CollectionEntry<C>["data"], string | Date>;
  /**
   * The entries order.
   */
  order: Order;
};

/**
 * Check if the given key is present in both objects.
 *
 * @param {T1} a - An object.
 * @param {T2} b - Another object.
 * @param {string} key - The key to test.
 * @returns {boolean} True if the key is in both objects.
 */
const hasCommonKey = <
  T1 extends Record<string, unknown>,
  T2 extends Record<string, unknown>,
>(
  a: T1,
  b: T2,
  key: string,
): key is keyof SharedShape<T1, T2> => key in a && key in b;

/**
 * Order the entries in collection with the given instructions.
 *
 * @template C - CollectionEntry
 * @param {CollectionEntry<C>[]} entries - The collection entries.
 * @param {QueryCollectionOrderBy<C>} orderBy - The ordering instructions.
 * @returns {CollectionEntry<C>[]} The ordered entries.
 */
const getOrderedEntries = <C extends CollectionKey>(
  entries: CollectionEntry<C>[],
  { key, order }: QueryCollectionOrderBy<C>,
): CollectionEntry<C>[] => {
  const orderedEntries = [...entries].sort((a, b) => {
    const sourceA =
      "meta" in a.data && key in a.data.meta ? a.data.meta : a.data;
    const sourceB =
      "meta" in b.data && key in b.data.meta ? b.data.meta : b.data;

    if (!hasCommonKey(sourceA, sourceB, key))
      throw new Error(`Property ${key} must be available in both entries.`);

    return sortByKey(sourceA, sourceB, key);
  });

  return order === "DESC" ? orderedEntries.reverse() : orderedEntries;
};

type QueryCollectionWhere = {
  /**
   * Retrieve only entries attached to the given authors.
   */
  authors: LooseAutocomplete<CollectionEntry<"authors">["id"]>[];
  /**
   * Retrieve only entries attached to the given blog categories.
   */
  categories: LooseAutocomplete<CollectionEntry<"blogCategories">["id"]>[];
  /**
   * Retrieve only entries with a matching id.
   */
  ids: string[];
  /**
   * Retrieve only entries in the given locale.
   */
  locale: LooseAutocomplete<AvailableLanguage>;
  /**
   * Retrieve only entries attached to the given tags.
   */
  tags: LooseAutocomplete<CollectionEntry<"tags">["id"]>[];
};

type CollectionEntryWithMeta<C extends CollectionKey> = HasNestedKey<
  CollectionEntry<C>,
  "data",
  "meta"
>;

const hasMetaProperty = <C extends CollectionKey>(
  entry: CollectionEntry<C>,
): entry is CollectionEntryWithMeta<C> => {
  return "meta" in entry.data && "isDraft" in entry.data.meta;
};

const hasDraftProperty = <C extends CollectionKey>(
  entry: CollectionEntry<C>,
): entry is CollectionEntry<C> & { data: { meta: { isDraft?: boolean } } } => {
  return hasMetaProperty(entry) && "isDraft" in entry.data.meta;
};

const isDraftOnProd = (
  entry: CollectionEntryWithMeta<CollectionKey>,
): boolean => {
  if (!hasDraftProperty(entry) || !import.meta.env.PROD) return false;

  return entry.data.meta.isDraft;
};

const matchesAuthors = (
  entry: CollectionEntryWithMeta<CollectionKey>,
  authors?: string[],
): boolean => {
  if (!authors) return true;
  if (!authors.length || !entry.data.meta || !("authors" in entry.data.meta))
    return false;

  return entry.data.meta.authors.some((ref) =>
    authors.some((author) => author === ref.id),
  );
};

const matchesCategories = (
  entry: CollectionEntryWithMeta<CollectionKey>,
  categories?: string[],
): boolean => {
  if (!categories?.length) return true;

  return (
    "category" in entry.data.meta &&
    categories.includes(entry.data.meta.category.id)
  );
};

const matchesIds = (
  entry: CollectionEntry<CollectionKey>,
  ids?: string[],
): boolean => {
  return !ids?.length || ids.includes(entry.id);
};

const hasLocaleInDescription = (
  entry: CollectionEntry<CollectionKey>,
  locale: string,
): boolean => {
  if (!("description" in entry.data)) return false;
  if (!entry.data.description) return false;
  if (typeof entry.data.description !== "object") return false;

  return locale in entry.data.description;
};

const hasMatchingLocaleProperty = (
  entry: CollectionEntry<CollectionKey>,
  locale: string,
): boolean => {
  if (!("locale" in entry.data)) return false;
  if (!entry.data.locale) return false;

  return entry.data.locale === locale;
};

const matchesLocale = (
  entry: CollectionEntry<CollectionKey>,
  locale?: string,
): boolean => {
  if (!locale) return true;

  const hasNoLocaleInfo =
    (!("description" in entry.data) || !isObject(entry.data.description)) &&
    !("locale" in entry.data);

  if (hasNoLocaleInfo) return true;

  return (
    hasLocaleInDescription(entry, locale) ||
    hasMatchingLocaleProperty(entry, locale)
  );
};

const matchesTags = (
  entry: CollectionEntryWithMeta<CollectionKey>,
  tags?: string[],
): boolean => {
  if (!tags?.length) return true;

  return (
    "tags" in entry.data.meta &&
    !!entry.data.meta.tags &&
    entry.data.meta.tags.some((ref) => tags.some((tag) => tag === ref.id))
  );
};

const applyCollectionFilters =
  (filters: Partial<QueryCollectionWhere> = {}) =>
  (entry: CollectionEntry<CollectionKey>) => {
    const { authors, categories, ids, locale, tags } = filters;

    if (!hasMetaProperty(entry))
      return matchesIds(entry, ids) && matchesLocale(entry, locale);

    return (
      !isDraftOnProd(entry) &&
      matchesAuthors(entry, authors) &&
      matchesCategories(entry, categories) &&
      matchesIds(entry, ids) &&
      matchesLocale(entry, locale) &&
      matchesTags(entry, tags)
    );
  };

type QueryCollectionOptions<C extends CollectionKey, F extends EntryFormat> = {
  /**
   * Return only the given number of entries.
   */
  first?: number;
  /**
   * Return only entries after the given index (starting from `0`).
   */
  after?: number;
  /**
   * The format of the returned entries.
   *
   * @default "full"
   */
  format?: F;
  /**
   * Sort the entries.
   */
  orderBy?: QueryCollectionOrderBy<C>;
  /**
   * Retrieve only entries that match the following filters.
   */
  where?: Partial<QueryCollectionWhere>;
};

export type QueriedCollection<
  C extends CollectionKey,
  F extends EntryFormat,
> = {
  /**
   * The queried collection entries.
   */
  entries: Awaited<ReturnType<typeof formatEntry<C, F>>>[];
  /**
   * The total entries count before applying `first` and/or `after`.
   */
  total: number;
};

const processEntries = async <C extends CollectionKey, F extends EntryFormat>(
  entries: CollectionEntry<C>[],
  options: Omit<QueryCollectionOptions<C, F>, "where"> = {},
): Promise<QueriedCollection<C, F>> => {
  const { after = 0, first, format, orderBy } = options;
  const orderedEntries = orderBy
    ? getOrderedEntries(entries, orderBy)
    : entries;
  const paginatedEntries =
    first !== undefined
      ? orderedEntries.slice(after, after + first)
      : orderedEntries.slice(after);
  const formattedEntries = await Promise.all(
    paginatedEntries.map((entry) => formatEntry(entry, format)),
  );

  return {
    entries: formattedEntries,
    total: entries.length,
  };
};

/**
 * Filter tags by locale.
 *
 * @param {CollectionReference<"tags">[]} tags - The list of tags.
 * @param {string} locale - The target locale.
 * @returns {CollectionReference<"tags">[]} The filtered tags for the given locale.
 */
const filterTagsReferencesByLocale = (
  tags: CollectionReference<"tags">[],
  locale: string,
): CollectionReference<"tags">[] => {
  return tags.filter((tag) => tag.id.startsWith(`${locale}/`));
};

/**
 * Transform the entries to filter tags based on the provided locale.
 *
 * @template C - CollectionKey
 * @param {CollectionEntry<C>[]} entries - The collection entries.
 * @param {string} [locale] - The locale to filter tags by.
 * @returns {CollectionEntry<C>[]} The transformed entries.
 */
const transformEntriesForLocale = <C extends CollectionKey>(
  entries: CollectionEntry<C>[],
  locale?: string,
): CollectionEntry<C>[] => {
  if (!locale) return entries;

  return entries.map((entry) => {
    if (
      !("meta" in entry.data) ||
      !("tags" in entry.data.meta) ||
      !entry.data.meta.tags?.length
    )
      return entry;

    const filteredTags = filterTagsReferencesByLocale(
      entry.data.meta.tags,
      locale,
    );

    return {
      ...entry,
      data: {
        ...entry.data,
        meta: {
          ...entry.data.meta,
          tags: filteredTags,
        },
      },
    };
  });
};

/**
 * Query a collection using filters.
 *
 * @template C - CollectionKey
 * @template F - EntryFormat
 * @param {C} collection - The collection name.
 * @param {Partial<QueryCollectionOptions<C, F>>} options - The options.
 * @returns {Promise<QueriedCollection<C, F>>} The collection entries.
 */
export const queryCollection = async <
  C extends CollectionKey,
  F extends EntryFormat = "full",
>(
  collection: C,
  options: QueryCollectionOptions<C, F> = {},
): Promise<QueriedCollection<C, F>> => {
  const { where, ...remainingOptions } = options;
  const filteredEntries = await getCollection(
    collection,
    applyCollectionFilters(where),
  );
  const transformedEntries = transformEntriesForLocale(
    filteredEntries,
    options.where?.locale,
  );

  return processEntries(transformedEntries, remainingOptions);
};

/**
 * Query multiple collections at once using filters.
 *
 * @template C - CollectionKey
 * @template F - EntryFormat
 * @param {C[]} collections - The collections names.
 * @param {Partial<QueryCollectionOptions<C, F>>} options - The options.
 * @returns {Promise<QueriedCollection<C, F>>} The collection entries.
 */
export const queryCollections = async <
  C extends CollectionKey,
  F extends EntryFormat = "full",
>(
  collections: C[],
  options: QueryCollectionOptions<C, F> = {},
): Promise<QueriedCollection<C, F>> => {
  const { where, ...remainingOptions } = options;
  const filteredEntries = (
    await Promise.all(
      collections.map((collection) =>
        getCollection(collection, applyCollectionFilters(where)),
      ),
    )
  ).flat();
  const transformedEntries = transformEntriesForLocale(
    filteredEntries,
    options.where?.locale,
  );

  return processEntries(transformedEntries, remainingOptions);
};
