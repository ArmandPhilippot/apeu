import type { CollectionEntry, CollectionKey } from "astro:content";
import {
  formatEntry,
  type FormatEntryConfig,
  type FormatEntryReturnMap,
} from "../../lib/astro/collections/formatters";
import { getEntriesIndex } from "../../lib/astro/collections/indexes";
import type { QueryMode } from "../../types/data";
import type { IndexedEntry } from "../../types/routing";
import type { AvailableLanguage, Order } from "../../types/tokens";
import type {
  HasNestedKey,
  KeyOfType,
  LooseAutocomplete,
} from "../../types/utilities";
import { hasCommonKey } from "../../utils/objects";
import { sortByKey } from "../../utils/sorting";
import { isObject, isString } from "../../utils/type-guards";
import { updateEntriesTagsForLocale } from "./utils";

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

type QueryCollectionWhere = {
  /**
   * Retrieve only entries attached to the given authors.
   */
  authors: LooseAutocomplete<CollectionEntry<"authors">["id"]>[];
  /**
   * Retrieve only entries attached to the given blog categories.
   */
  categories: LooseAutocomplete<CollectionEntry<"blog.categories">["id"]>[];
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

type HasMeta<T> =
  T extends IndexedEntry<CollectionKey>
    ? HasNestedKey<T, ["raw", "data", "meta"]>
    : never;

const hasDraftProperty = <C extends CollectionKey>(
  entry: HasMeta<IndexedEntry<C>>
): entry is HasMeta<IndexedEntry<C>> & {
  raw: {
    data: { meta: { isDraft?: boolean } };
  };
} => "meta" in entry.raw.data && "isDraft" in entry.raw.data.meta;

const isDraftOnProd = (
  entry: HasMeta<IndexedEntry<CollectionKey>>
): boolean => {
  if (hasDraftProperty(entry) && import.meta.env.PROD) {
    return entry.raw.data.meta.isDraft;
  }

  return false;
};

const matchesAuthors = (
  entry: HasMeta<IndexedEntry<CollectionKey>>,
  authors?: QueryCollectionWhere["authors"]
): boolean => {
  if (authors === undefined) return true;
  if (authors.length === 0 || !("authors" in entry.raw.data.meta)) return false;

  return entry.raw.data.meta.authors.some((ref) => authors.includes(ref.id));
};

const matchesCategories = (
  entry: HasMeta<IndexedEntry<CollectionKey>>,
  categories?: QueryCollectionWhere["categories"]
): boolean => {
  if (categories === undefined || categories.length === 0) return true;

  return (
    "category" in entry.raw.data.meta &&
    categories.includes(entry.raw.data.meta.category.id)
  );
};

const matchesCollections = (
  entry: IndexedEntry<CollectionKey>,
  collections: CollectionKey[]
): boolean => collections.includes(entry.raw.collection);

const matchesIds = (
  entry: IndexedEntry<CollectionKey>,
  ids?: QueryCollectionWhere["ids"]
): boolean =>
  ids === undefined || ids.length === 0 || ids.includes(entry.raw.id);

const matchesLocale = (
  entry: IndexedEntry<CollectionKey>,
  locale?: QueryCollectionWhere["locale"]
): boolean => {
  if (locale === undefined) return true;

  const hasNoLocaleInfo =
    (!("description" in entry.raw.data) ||
      !isObject(entry.raw.data.description)) &&
    !("locale" in entry.raw.data);
  const descriptionMatches =
    "description" in entry.raw.data &&
    isObject(entry.raw.data.description) &&
    locale in entry.raw.data.description;
  const localePropertyMatches =
    "locale" in entry.raw.data && entry.raw.data.locale === locale;

  return hasNoLocaleInfo || descriptionMatches || localePropertyMatches;
};

const matchesTags = (
  entry: HasMeta<IndexedEntry<CollectionKey>>,
  tags?: QueryCollectionWhere["tags"]
): boolean => {
  if (tags === undefined || tags.length === 0) return true;

  return (
    "tags" in entry.raw.data.meta &&
    Array.isArray(entry.raw.data.meta.tags) &&
    entry.raw.data.meta.tags.some((ref) => tags.includes(ref.id))
  );
};

const hasMetaProperty = <C extends CollectionKey>(
  entry: IndexedEntry<C>
): entry is HasMeta<IndexedEntry<C>> => "meta" in entry.raw.data;

const matchesCollectionsAndFilters =
  <C extends CollectionKey>(
    collections: CollectionKey[],
    filters: Partial<QueryCollectionWhere> | undefined
  ) =>
  (entry: IndexedEntry<CollectionKey>): entry is IndexedEntry<C> => {
    if (filters === undefined) return matchesCollections(entry, collections);

    if (!hasMetaProperty(entry)) {
      return (
        matchesCollections(entry, collections) &&
        matchesIds(entry, filters.ids) &&
        matchesLocale(entry, filters.locale)
      );
    }

    return (
      matchesAuthors(entry, filters.authors) &&
      matchesCategories(entry, filters.categories) &&
      matchesCollections(entry, collections) &&
      matchesIds(entry, filters.ids) &&
      matchesLocale(entry, filters.locale) &&
      matchesTags(entry, filters.tags) &&
      !isDraftOnProd(entry)
    );
  };

/**
 * Order the entries in collection with the given instructions.
 *
 * @template C - A collection key.
 * @param {IndexedEntry<C>[]} entries - The collection entries.
 * @param {QueryCollectionOrderBy<C>} orderBy - The ordering instructions.
 * @returns {IndexedEntry<C>[]} The entries ordered using the ordering configuration.
 * @throws {Error} When one of the entries doesn't provide the order by key.
 */
const getOrderedEntries = <C extends CollectionKey>(
  entries: IndexedEntry<C>[],
  orderBy: QueryCollectionOrderBy<C> | undefined
): IndexedEntry<C>[] => {
  if (orderBy === undefined) return entries;

  const { key, order } = orderBy;
  const orderedEntries = [...entries].sort((a, b) => {
    const sourceA =
      "meta" in a.raw.data && key in a.raw.data.meta
        ? a.raw.data.meta
        : a.raw.data;
    const sourceB =
      "meta" in b.raw.data && key in b.raw.data.meta
        ? b.raw.data.meta
        : b.raw.data;

    if (!hasCommonKey(sourceA, sourceB, key)) {
      throw new Error(`Property ${key} must be available in both entries.`);
    }

    return sortByKey(sourceA, sourceB, key);
  });

  return order === "DESC" ? orderedEntries.reverse() : orderedEntries;
};

const ensureArray = <T extends string>(item: T | T[]): T[] =>
  isString(item) ? [item] : item;

const paginateEntries = <C extends CollectionKey>(
  entries: IndexedEntry<C>[],
  after: number,
  first?: number
): IndexedEntry<C>[] =>
  first === undefined
    ? entries.slice(after)
    : entries.slice(after, after + first);

const formatEntries = async <C extends CollectionKey, F extends QueryMode>(
  entries: IndexedEntry<C>[],
  config: FormatEntryConfig<F>
): Promise<Awaited<ReturnType<typeof formatEntry<C, F>>>[]> =>
  Promise.all(entries.map(async (entry) => formatEntry(entry, config)));

type QueryCollectionOptions<C extends CollectionKey, F extends QueryMode> = {
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

export type QueriedCollectionEntry<
  C extends CollectionKey,
  F extends QueryMode,
> = Awaited<ReturnType<FormatEntryReturnMap<F>[C]>>;

export type QueriedCollection<C extends CollectionKey, F extends QueryMode> = {
  /**
   * The queried collection entries.
   */
  entries: QueriedCollectionEntry<C, F>[];
  /**
   * The total entries count before applying `first` and/or `after`.
   */
  total: number;
};

/**
 * Query one or multiple collections at once using filters.
 *
 * @template C - CollectionKey.
 * @template F - QueryMode.
 * @param {C | C[]} collections - The collections names.
 * @param {Partial<QueryCollectionOptions<C>>} options - The options used to filter the queried entries.
 * @returns {Promise<QueriedCollection<C>>} The collection entries.
 */
export const queryCollection = async <
  C extends CollectionKey,
  F extends QueryMode = "full",
>(
  collections: C | C[],
  options: QueryCollectionOptions<C, F> = {}
): Promise<QueriedCollection<C, F>> => {
  const { after = 0, first, format, orderBy, where } = options;
  const queriedCollections = ensureArray(collections);
  const { byId } = await getEntriesIndex();
  const filteredEntries = [...byId.values()].filter<IndexedEntry<C>>(
    matchesCollectionsAndFilters(queriedCollections, where)
  );
  const orderedEntries = getOrderedEntries(filteredEntries, orderBy);
  const paginatedEntries = paginateEntries(orderedEntries, after, first);
  const transformedEntries = updateEntriesTagsForLocale<C>(
    paginatedEntries,
    where?.locale
  );
  const formattedEntries = await formatEntries<C, F>(transformedEntries, {
    format,
    indexById: byId,
  });

  return {
    entries: formattedEntries,
    total: filteredEntries.length,
  };
};
