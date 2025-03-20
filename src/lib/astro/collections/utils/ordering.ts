import type { CollectionEntry, CollectionKey } from "astro:content";
import { hasCommonKey } from "../../../../utils/objects";
import { sortByKey } from "../../../../utils/sort";
import type { QueryCollectionOrderBy } from "./types";

/**
 * Order the entries in collection with the given instructions.
 *
 * @template C - CollectionEntry.
 * @param {CollectionEntry<C>[]} entries - The collection entries.
 * @param {QueryCollectionOrderBy<C>} orderBy - The ordering instructions.
 * @returns {CollectionEntry<C>[]} The entries ordered using the ordering configuration.
 * @throws {Error} When one of the entries doesn't provide the order by key.
 */
export const getOrderedEntries = <C extends CollectionKey>(
  entries: CollectionEntry<C>[],
  orderBy: QueryCollectionOrderBy<C> | undefined
): CollectionEntry<C>[] => {
  if (orderBy === undefined) return entries;

  const { key, order } = orderBy;
  const orderedEntries = [...entries].sort((a, b) => {
    const sourceA =
      "meta" in a.data && key in a.data.meta ? a.data.meta : a.data;
    const sourceB =
      "meta" in b.data && key in b.data.meta ? b.data.meta : b.data;

    if (!hasCommonKey(sourceA, sourceB, key)) {
      throw new Error(`Property ${key} must be available in both entries.`);
    }

    return sortByKey(sourceA, sourceB, key);
  });

  return order === "DESC" ? orderedEntries.reverse() : orderedEntries;
};
