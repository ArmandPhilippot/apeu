import type { CollectionEntry, CollectionKey } from "astro:content";

/**
 * Flattens the entries and sorts them to ensure parent (index) pages
 * appear before their child pages — based on the `id` order.
 *
 * @template T - The entries type.
 * @param {T[][]} nested - A nested array.
 * @returns {T[]} A flatten and sorted array.
 */
export const flattenAndSortByHierarchy = <T extends { id: string }>(
  nested: T[][]
): T[] =>
  nested.flat().sort((a, b) => {
    const aDepth = a.id.split("/").length;
    const bDepth = b.id.split("/").length;

    // First sort by depth (parents before children)
    if (aDepth !== bDepth) {
      return aDepth - bDepth;
    }

    // Then sort alphabetically for consistent ordering
    return a.id.localeCompare(b.id);
  });

/**
 * Normalize an id in the authors collection by removing the virtual `authors` directory from the id.
 *
 * @param {string} id - The id to clean.
 * @returns {string} The cleaned id.
 */
export const normalizeAuthorsId = (id: string): string =>
  id.replace(/^authors\//, "");

/**
 * Normalize an id in the pages collection by removing the virtual `pages` directory from the id.
 *
 * @param {string} id - The id to clean.
 * @returns {string} The cleaned id.
 */
export const normalizePagesId = (id: string): string =>
  id.replace("/pages/", "/");

/**
 * Normalize an id in the a collection by removing the virtual directory from the id.
 *
 * @param {string} entry - A collection entry.
 * @returns {string} The cleaned id.
 */
export const normalizeEntryId = (
  entry: CollectionEntry<CollectionKey>
): string => {
  if (entry.collection === "authors") return normalizeAuthorsId(entry.id);
  if (entry.collection === "pages") return normalizePagesId(entry.id);
  return entry.id;
};
