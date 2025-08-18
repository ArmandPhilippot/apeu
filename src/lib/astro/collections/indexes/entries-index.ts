import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { collections } from "../../../../content.config";
import {
  isAvailableLanguage,
  isDefaultLanguage,
} from "../../../../services/i18n";
import type {
  IndexedEntry,
  NonRoutableCollectionKey,
  NonRoutableIndexedEntry,
  RoutableCollectionKey,
  RoutableIndexedEntry,
} from "../../../../types/routing";
import type { AvailableLanguage } from "../../../../types/tokens";
import { getCumulativePaths } from "../../../../utils/paths";
import { removeTrailingSlashes } from "../../../../utils/strings";
import { isRoutableEntry } from "../type-guards";
import { flattenAndSortByHierarchy, normalizeEntryId } from "./utils";

/**
 * Loads and normalizes all entries for a given collection.
 *
 * If the collection is `pages`, it will normalize entry IDs
 * to remove the language prefix from the root route.
 * Otherwise, it simply returns the collection's entries as-is.
 *
 * @param {CollectionKey} collection - The name of the content collection to load.
 * @returns {Promise<CollectionEntry<CollectionKey>>} A promise that resolves to the array of collection entries.
 */
const fetchCollectionEntries = async (
  collection: CollectionKey
): Promise<CollectionEntry<CollectionKey>[]> => {
  const entries = await getCollection(collection);
  return entries.map((entry) => {
    return {
      ...entry,
      id: normalizeEntryId(entry),
    };
  });
};

/**
 * Fetches and flattens all entries from all defined collections,
 * ensuring parent pages are ordered before child pages.
 *
 * @returns {Promise<CollectionEntry<CollectionKey>[]>} A sorted flat array of all collection entries.
 */
const getAllEntries = async (): Promise<CollectionEntry<CollectionKey>[]> => {
  const allCollections = Object.keys(collections) as CollectionKey[];
  const allEntries = await Promise.all(
    allCollections.map(fetchCollectionEntries)
  );

  return flattenAndSortByHierarchy(allEntries);
};

/**
 * Converts a non-routable entry into its indexed version.
 *
 * @template C - A non routable collection key.
 * @param {CollectionEntry<C>} entry - The non-routable collection entry.
 * @returns {NonRoutableIndexedEntry<C>} An indexed version with type `IndexedEntry`.
 */
const buildNonRoutableIndexedEntry = <C extends NonRoutableCollectionKey>(
  entry: CollectionEntry<C>
): NonRoutableIndexedEntry<C> => {
  return {
    raw: entry,
  };
};

/**
 * Ensure the given locale is both defined and a configured locale.
 *
 * @param {string | undefined} locale - A locale to check.
 * @returns {AvailableLanguage} A supported locale.
 * @throws {Error} When the given locale is not supported.
 */
const getLocale = (locale: string | undefined): AvailableLanguage => {
  if (locale === undefined || !isAvailableLanguage(locale)) {
    throw new Error(`"${locale}" is not a supported locale.`);
  }

  return locale;
};

/**
 * Extracts a localized slug from a routable entry.
 * Falls back to the last segment of the ID if no permaslug is defined.
 *
 * @param {CollectionEntry<RoutableCollectionKey>} entry - A content entry from a routable collection.
 * @returns {string} The resolved slug.
 * @throws {Error} If no slug can be determined.
 */
const getSlugFromEntry = (
  entry: CollectionEntry<RoutableCollectionKey>
): string => {
  const fallback = entry.id.split("/").at(-1);
  const slug = entry.data.permaslug ?? fallback;
  if (slug === undefined) {
    throw new Error(`Cannot determine slug for entry: ${entry.id}`);
  }
  return slug === "home" ? "" : slug;
};

type SlugInfoByIdMap = Map<
  CollectionEntry<RoutableCollectionKey>["id"],
  { collection: CollectionKey; slug: string }
>;

/**
 * Builds a map of entry IDs to slugs for all routable entries.
 *
 * @param {CollectionEntry<CollectionKey>[]} entries - All content entries from all collections.
 * @returns {SlugInfoByIdMap} A map of entry ID → slug and collection.
 */
const buildSlugInfoByIdMap = (
  entries: CollectionEntry<CollectionKey>[]
): SlugInfoByIdMap => {
  const index: SlugInfoByIdMap = new Map();

  for (const entry of entries) {
    const indexedEntry = index.get(entry.id);
    if (indexedEntry !== undefined) {
      console.warn(
        `Duplicate id "${entry.id}" in collections "${entry.collection}" and "${indexedEntry.collection}" — skipping.`
      );
    } else if (isRoutableEntry(entry)) {
      index.set(entry.id, {
        collection: entry.collection,
        slug: getSlugFromEntry(entry),
      });
    }
  }

  return index;
};

const removeLeadingSlash = (path: string) => path.slice(1);

/**
 * Builds a localized route for a content entry using cumulative slugs.
 *
 * @param {AvailableLanguage} locale - A supported entry's locale.
 * @param {string[]} segments - Path segments extracted from the entry ID.
 * @param {SlugInfoByIdMap} slugById - A map of entry IDs to slugs.
 * @returns {string} A route like `/fr/section/article`.
 */
const buildEntryRoute = (
  locale: AvailableLanguage,
  segments: string[],
  slugById: SlugInfoByIdMap
): string => {
  const routes = getCumulativePaths(`${locale}/${segments.join("/")}`);
  const localizedSegments = routes
    .map((route, idx) => {
      const shouldRemoveLocale = idx === 0 && isDefaultLanguage(locale);
      if (shouldRemoveLocale) return null;
      const id = removeLeadingSlash(route);
      return slugById.get(id)?.slug ?? id.split("/").at(-1) ?? null;
    })
    .filter((segment) => segment !== null);
  const route = `/${localizedSegments.join("/")}`;

  return route === "/" ? route : removeTrailingSlashes(route);
};

type RouteInfo = {
  locale: AvailableLanguage;
  route: string;
  slug: string;
};

/**
 * Extracts locale, slug and route from a routable entry id using an index.
 *
 * @param {string} id - The id of a routable entry.
 * @param {SlugInfoByIdMap} slugById - Index of entries slug by ID.
 * @returns {RouteInfo} The route metadata (slug, route, and locale).
 * @throws {Error} When the slug cannot be resolved using the entry id.
 */
const getRoutableEntryInfo = (
  id: string,
  slugById: SlugInfoByIdMap
): RouteInfo => {
  const [maybeLocale, ...rest] = id.split("/");
  const locale = getLocale(maybeLocale);
  const slug = slugById.get(id)?.slug;

  if (slug === undefined) throw new Error(`Missing slug for entry ID: ${id}`);

  const route = buildEntryRoute(locale, rest, slugById);

  return { locale, route, slug };
};

/**
 * Ensures the entry has the correct locale in its `data.locale` field.
 *
 * @template C - The routable collection key.
 * @param {CollectionEntry<C>} entry - A routable entry.
 * @param {AvailableLanguage} locale - The expected locale.
 * @returns {CollectionEntry<C>} A normalized entry.
 */
const prepareEntry = <C extends RoutableCollectionKey>(
  entry: CollectionEntry<C>,
  locale: AvailableLanguage
): CollectionEntry<C> => {
  if (entry.data.locale === locale) return entry;

  return {
    ...entry,
    data: {
      ...entry.data,
      locale,
    },
  };
};

/**
 * Converts a routable entry into its indexed form with route and slug info.
 *
 * @template C - The routable collection key.
 * @param {CollectionEntry<C>} entry - The entry to index.
 * @param {SlugInfoByIdMap} slugById - Index for resolving parent slugs.
 * @returns {RoutableIndexedEntry<C>} An object describing an indexed routable entry.
 */
const buildRoutableIndexedEntry = <C extends RoutableCollectionKey>(
  entry: CollectionEntry<C>,
  slugById: SlugInfoByIdMap
): RoutableIndexedEntry<C> => {
  const { locale, route, slug } = getRoutableEntryInfo(entry.id, slugById);

  return {
    raw: prepareEntry(entry, locale),
    route,
    slug,
  };
};

type IndexableEntries = {
  nonRoutable: IndexedEntry<NonRoutableCollectionKey>[];
  routable: IndexedEntry<RoutableCollectionKey>[];
};

/**
 * Build and splits content entries into routable and non-routable groups.
 *
 * @param {CollectionEntry<CollectionKey>[]} entries - All content entries.
 * @param {SlugInfoByIdMap} slugById - Precomputed slugs for routable entries.
 * @returns {IndexableEntries} An object with `routable` and `nonRoutable` arrays.
 */
const buildAndSplitIndexableEntries = (
  entries: CollectionEntry<CollectionKey>[],
  slugById: SlugInfoByIdMap
): IndexableEntries => {
  const nonRoutable: IndexedEntry<NonRoutableCollectionKey>[] = [];
  const routable: IndexedEntry<RoutableCollectionKey>[] = [];

  for (const entry of entries) {
    if (!isRoutableEntry(entry)) {
      nonRoutable.push(buildNonRoutableIndexedEntry(entry));
      continue;
    }

    const slugInfo = slugById.get(entry.id);
    if (slugInfo?.collection !== entry.collection) continue;

    routable.push(buildRoutableIndexedEntry(entry, slugById));
  }

  return {
    nonRoutable,
    routable,
  };
};

/**
 * Builds a generic index from a list of entries using a custom key function.
 *
 * This allows indexing both routable and non-routable entries by any derived
 * key, such as `entry.raw.id` or `entry.id`.
 *
 * @template T - The collection key.
 * @param {IndexedEntry<T>[]} entries - The array of indexed entries to index.
 * @param {(entry: IndexedEntry<T>) => string} getKey - A function that returns the index key for a given entry.
 * @returns {Map<string, IndexedEntry<T>>} A Map where each key is computed from `getKey(entry)` and each value is the entry itself.
 */
const buildEntryIndex = <T extends CollectionKey>(
  entries: IndexedEntry<T>[],
  getKey: (entry: IndexedEntry<T>) => string
): Map<string, IndexedEntry<T>> => {
  const index = new Map<string, IndexedEntry<T>>();

  for (const entry of entries) {
    const key = getKey(entry);
    const indexedEntry = index.get(key);

    if (indexedEntry !== undefined) {
      console.warn(
        `Duplicate key "${key}" in collections "${entry.raw.collection}" and "${indexedEntry.raw.collection}" — skipping.`
      );
      continue;
    }

    index.set(key, entry);
  }

  return index;
};

export type EntryByIdIndex = Map<
  string,
  IndexedEntry<NonRoutableCollectionKey | RoutableCollectionKey>
>;

export type EntryByRouteIndex = Map<
  string,
  IndexedEntry<RoutableCollectionKey>
>;

export type EntriesIndexes = {
  /**
   * A Map indexing the entries by id.
   */
  byId: EntryByIdIndex;
  /**
   * A Map indexing only the routable entries by route.
   */
  byRoute: EntryByRouteIndex;
};

/**
 * Builds two indexes for all entries, one using id as key and the other using
 * the route.
 *
 * @returns {EntriesIndexes} Both byId and byRoute indexes.
 */
const buildEntriesIndexes = async (): Promise<EntriesIndexes> => {
  const entries = await getAllEntries();
  const slugById = buildSlugInfoByIdMap(entries);
  const { nonRoutable, routable } = buildAndSplitIndexableEntries(
    entries,
    slugById
  );
  const entryById = buildEntryIndex(
    [...nonRoutable, ...routable],
    (entry) => entry.raw.id
  );
  const entryByRoute = buildEntryIndex(routable, (entry) => entry.route);

  return {
    byId: entryById,
    byRoute: entryByRoute,
  };
};

let cachedIndexes: EntriesIndexes | null = null;

/**
 * Returns a cached or freshly built set of content indexes.
 *
 * @returns {Promise<EntriesIndexes>} The index maps for all content entries.
 */
export const getEntriesIndex = async (): Promise<EntriesIndexes> => {
  if (cachedIndexes === null) {
    const freshIndexed = await buildEntriesIndexes();
    cachedIndexes ??= freshIndexed;
  }

  return cachedIndexes;
};

/**
 * Reset the memoized cache containing the entries index.
 */
export const clearEntriesIndexCache = () => {
  cachedIndexes = null;
};
