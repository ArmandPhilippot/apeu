import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { formatEntry, type EntryFormat } from "./format-entry";
import { applyCollectionFilters } from "./utils/filters";
import { getOrderedEntries } from "./utils/ordering";
import { updateEntriesTagsForLocale } from "./utils/transformations";
import type {
  QueryCollectionOrderBy,
  QueryCollectionWhere,
} from "./utils/types";

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

const paginateEntries = <C extends CollectionKey>(
  entries: CollectionEntry<C>[],
  after: number,
  first?: number,
): CollectionEntry<C>[] =>
  first !== undefined
    ? entries.slice(after, after + first)
    : entries.slice(after);

const formatEntries = async <C extends CollectionKey, F extends EntryFormat>(
  entries: CollectionEntry<C>[],
  format?: F,
): Promise<Awaited<ReturnType<typeof formatEntry<C, F>>>[]> =>
  Promise.all(entries.map((entry) => formatEntry(entry, format)));

const processEntries = async <C extends CollectionKey, F extends EntryFormat>(
  entries: CollectionEntry<C>[],
  options: Omit<QueryCollectionOptions<C, F>, "where"> = {},
): Promise<QueriedCollection<C, F>> => {
  const { after = 0, first, format, orderBy } = options;
  const orderedEntries = getOrderedEntries(entries, orderBy);
  const paginatedEntries = paginateEntries(orderedEntries, after, first);
  const formattedEntries = await formatEntries(paginatedEntries, format);

  return {
    entries: formattedEntries,
    total: entries.length,
  };
};

/**
 * Query one or multiple collections at once using filters.
 *
 * @template C - CollectionKey
 * @template F - EntryFormat
 * @param {C | C[]} collections - The collections names.
 * @param {Partial<QueryCollectionOptions<C, F>>} options - The options.
 * @returns {Promise<QueriedCollection<C, F>>} The collection entries.
 */
export const queryCollection = async <
  C extends CollectionKey,
  F extends EntryFormat = "full",
>(
  collections: C | C[],
  options: QueryCollectionOptions<C, F> = {},
): Promise<QueriedCollection<C, F>> => {
  const { where, ...remainingOptions } = options;
  const collectionArray = Array.isArray(collections)
    ? collections
    : [collections];

  const filteredEntries = (
    await Promise.all(
      collectionArray.map((collection) =>
        getCollection(collection, applyCollectionFilters(where)),
      ),
    )
  ).flat();

  const transformedEntries = updateEntriesTagsForLocale(
    filteredEntries,
    options.where?.locale,
  );

  return processEntries(transformedEntries, remainingOptions);
};
