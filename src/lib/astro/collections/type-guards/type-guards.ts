import type { CollectionEntry, CollectionKey } from "astro:content";
import type {
  IndexedEntry,
  RoutableCollectionKey,
} from "../../../../types/routing";

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

/**
 * Check if the given indexed entry is a routable entry.
 *
 * @param {CollectionEntry<CollectionKey>} entry - The entry to test.
 * @returns {boolean} True if the entry is a routable indexed entry.
 */
export const isRoutableIndexedEntry = (
  entry: IndexedEntry<CollectionKey>
): entry is IndexedEntry<RoutableCollectionKey> =>
  isRoutableCollection(entry.raw.collection);

/**
 * Check if the given indexed entry is in the given collection.
 *
 * @template C - The collection key.
 * @param {IndexedEntry<CollectionKey>} entry - The indexed entry.
 * @param {C} collection - The collection key.
 * @returns {boolean} True if the entry is in the collection.
 */
export const isInCollection = <C extends CollectionKey>(
  entry: IndexedEntry<CollectionKey>,
  collection: C
): entry is IndexedEntry<C> => entry.raw.collection === collection;
