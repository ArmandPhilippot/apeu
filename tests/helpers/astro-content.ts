import {
  getCollection,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { vi } from "vitest";
import { isObject } from "../../src/utils/type-checks";

type MockEntry<T extends CollectionKey> = {
  id: string;
  collection: T;
  data?: Partial<CollectionEntry<T>["data"]>;
};

type EntriesByCollection = Partial<
  Record<CollectionKey, CollectionEntry<CollectionKey>[]>
>;

/**
 * Creates a mock Astro collection entry with default values.
 *
 * @template T - The collection key type (e.g., "pages", "posts").
 * @param {object} params - The mock entry parameters.
 * @param {string} params.id - The unique identifier for the entry (e.g., "en/pages/about").
 * @param {T} params.collection - The collection this entry belongs to.
 * @param {Partial<CollectionEntry<T>["data"]>} [params.data] - Optional partial data to override defaults.
 * @returns {CollectionEntry<T>} A complete mock collection entry with merged default values.
 *
 * @example
 * ```typescript
 * const mockPage = createMockEntry({
 *   id: "en/pages/about",
 *   collection: "pages",
 *   data: { title: "About Us" }
 * });
 * ```
 */
export const createMockEntry = <T extends CollectionKey>({
  collection,
  data,
  id,
}: MockEntry<T>): CollectionEntry<T> =>
  ({
    id,
    collection,
    data: {
      locale: "en",
      ...data,
      meta:
        data !== undefined && "meta" in data && isObject(data.meta)
          ? {
              ...data.meta,
              isDraft: false,
            }
          : {},
    },
  }) as CollectionEntry<T>;

/**
 * Creates an array of mock Astro collection entries from a simplified configuration.
 *
 * @param {MockEntry<CollectionKey>[]} entries - Array of mock entry configurations.
 * @returns {CollectionEntry<CollectionKey>[]} Array of complete mock collection entries.
 *
 * @example
 * ```typescript
 * const mockEntries = createMockEntries([
 *   { id: "en/pages/home", collection: "pages" },
 *   { id: "en/posts/hello", collection: "posts", data: { title: "Hello World" } }
 * ]);
 * ```
 */
export const createMockEntries = <T extends CollectionKey>(
  entries: MockEntry<T>[]
): CollectionEntry<T>[] => entries.map(createMockEntry);

const groupEntriesByCollection = (
  entries: CollectionEntry<CollectionKey>[]
): EntriesByCollection => {
  const groups: Partial<
    Record<CollectionKey, CollectionEntry<CollectionKey>[]>
  > = {};

  for (const entry of entries) {
    groups[entry.collection] ??= [];
    groups[entry.collection]?.push(entry);
  }

  return groups;
};

/**
 * Creates mock entries grouped by collection from mixed collection types.
 * Use this when you need entries for multiple different collection types.
 *
 * @param {object} entriesConfig - Configuration object with collections as keys.
 * @returns {EntriesByCollection} Entries grouped by collection.
 *
 * @example
 * ```typescript
 * const mockEntriesByCollection = createMockEntriesByCollection({
 *   authors: [
 *     { id: "author1", collection: "authors" as const },
 *     { id: "author2", collection: "authors" as const }
 *   ],
 *   "blog.posts": [
 *     {
 *       id: "en/post-1",
 *       collection: "blog.posts" as const,
 *       data: { meta: { isDraft: false } }
 *     }
 *   ]
 * });
 * ```
 */
export const createMockEntriesByCollection = <
  T extends CollectionKey,
>(entriesConfig: { [K in T]?: MockEntry<K>[] }): EntriesByCollection => {
  const result: EntriesByCollection = {};

  for (const [collection, entries] of Object.entries(entriesConfig)) {
    if (Array.isArray(entries)) {
      result[collection as CollectionKey] = entries.map((entry) =>
        createMockEntry(entry)
      );
    }
  }

  return result;
};

/**
 * Sets up Vitest mocks for Astro's content functions with collection-specific data.
 *
 * @param {CollectionEntry<CollectionKey>[] | EntriesByCollection} entries - Either a flat array of entries or entries grouped by collection.
 * @throws {Error} When content functions are not properly mocked with `vi.mock()`.
 *
 * @example
 * ```typescript
 * // Option 1: Flat array (single or mixed collections)
 * setupCollectionMocks([
 *   { id: "en/pages/home", collection: "pages" } as MockEntry<"pages">,
 *   { id: "en/posts/hello", collection: "posts" } as MockEntry<"posts">
 * ].map(createMockEntry));
 *
 * // Option 2: Using createMockEntries for single collection
 * setupCollectionMocks(createMockEntries([
 *   { id: "en/pages/home", collection: "pages" as const },
 *   { id: "en/pages/about", collection: "pages" as const }
 * ]));
 *
 * // Option 3: Using createMockEntriesByCollection for multiple collections
 * setupCollectionMocks(createMockEntriesByCollection({
 *   authors: [{ id: "author1", collection: "authors" as const }],
 *   "blog.posts": [{ id: "en/post-1", collection: "blog.posts" as const }]
 * }));
 * ```
 */
export const setupCollectionMocks = (
  entries: CollectionEntry<CollectionKey>[] | EntriesByCollection
) => {
  if (!vi.isMockFunction(getCollection)) {
    throw new Error(
      "getCollection is not mocked! Make sure to call vi.mock('astro:content', ...) in your test file before using setupCollectionMocks."
    );
  }

  if (!vi.isMockFunction(getEntry)) {
    throw new Error(
      "getEntry is not mocked! Make sure to call vi.mock('astro:content', ...) in your test file before using setupCollectionMocks."
    );
  }

  const entriesByCollection: EntriesByCollection = Array.isArray(entries)
    ? groupEntriesByCollection(entries)
    : entries;

  vi.mocked(getCollection).mockImplementation(
    async (
      collection: CollectionKey,
      filterFn: (entry: CollectionEntry<CollectionKey>) => boolean
      // eslint-disable-next-line @typescript-eslint/require-await -- Mock
    ) => {
      const mockedEntries = entriesByCollection[collection] ?? [];
      return mockedEntries.filter((entry) => {
        const matchesCollection = entry.collection === collection;
        const passesFilter =
          typeof filterFn === "function" ? Boolean(filterFn(entry)) : true;
        return matchesCollection && passesFilter;
      });
    }
  );

  vi.mocked(getEntry).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/require-await -- Mock
    async (collection: CollectionKey, id: string) =>
      entriesByCollection[collection]?.find(
        (collectionEntry) => collectionEntry.id === id
      )
  );
};
