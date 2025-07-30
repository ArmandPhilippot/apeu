import type { CollectionEntry, CollectionKey } from "astro:content";
import type { RoutableCollectionKey } from "../types/routing";

const ROUTABLE_COLLECTIONS = [
  "blog.categories",
  "blog.posts",
  "guides",
  "index.pages",
  "notes",
  "pages",
  "projects",
  "tags",
] as const satisfies RoutableCollectionKey[];

/**
 * Check if the given collection is routable.
 *
 * @param {string} collection - The collection key to test.
 * @returns {boolean} True if the collection is routable.
 */
export const isRoutableCollection = (
  collection: string
): collection is CollectionEntry<RoutableCollectionKey>["collection"] =>
  (ROUTABLE_COLLECTIONS as string[]).includes(collection);

/**
 * Check if the given entry is a routable entry.
 *
 * @param {CollectionEntry<CollectionKey>} entry - The entry to test.
 * @returns {boolean} True if the entry is a routable entry.
 */
export const isRoutableEntry = (
  entry: CollectionEntry<CollectionKey>
): entry is CollectionEntry<RoutableCollectionKey> =>
  isRoutableCollection(entry.collection);
