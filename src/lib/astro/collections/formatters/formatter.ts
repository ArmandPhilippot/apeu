import type { CollectionKey } from "astro:content";
import type { QueryMode } from "../../../../types/data";
import type { IndexedEntry, RoutableCollectionKey } from "../types";
import type { EntryByIdIndex } from "../indexes";
import { isRoutableIndexedEntry } from "../type-guards";
import { getAuthor, getAuthorPreview } from "./authors";
import { getBlog } from "./blogroll";
import { getBookmark } from "./bookmarks";
import { getRoutableEntry, getRoutableEntryPreview } from "./routable-entries";

const isIndexedEntryInCollection = <C extends CollectionKey>(
  entry: IndexedEntry<CollectionKey>,
  collection: C
): entry is IndexedEntry<C> => entry.raw.collection === collection;

type RoutableEntryReturnMap<F extends QueryMode | undefined> = {
  [K in RoutableCollectionKey]: F extends "full"
    ? typeof getRoutableEntry<K>
    : typeof getRoutableEntryPreview<K>;
};

type NonRoutableEntryReturnMap<F extends QueryMode | undefined> = {
  authors: F extends "full" ? typeof getAuthor : typeof getAuthorPreview;
  blogroll: typeof getBlog;
  bookmarks: typeof getBookmark;
};

export type FormatEntryConfig<F extends QueryMode> = {
  format?: F | undefined;
  indexById: EntryByIdIndex;
};

export type FormatEntryReturnMap<F extends QueryMode | undefined> =
  RoutableEntryReturnMap<F> & NonRoutableEntryReturnMap<F>;

/**
 * Format a collection entry to obtain either a full formatted entry or only a preview.
 *
 * @template C, F
 * @param {CollectionKey} entry - The collection entry.
 * @param {QueryMode} [format] - The format of the returned entry.
 * @returns {Promise<ReturnType<FormatEntryReturnMap<F>[C]>>} The formatted entry.
 * @throws When the collection is invalid.
 */
export async function formatEntry<
  C extends CollectionKey,
  F extends QueryMode = "full",
>(
  entry: IndexedEntry<C>,
  { indexById, format }: FormatEntryConfig<F>
): Promise<ReturnType<FormatEntryReturnMap<F>[C]>>;
export async function formatEntry<
  C extends CollectionKey,
  F extends QueryMode = "full",
>(entry: IndexedEntry<C>, { indexById, format }: FormatEntryConfig<F>) {
  const isFullVersion = format !== "preview";

  if (isRoutableIndexedEntry(entry)) {
    return isFullVersion
      ? getRoutableEntry(entry, indexById)
      : getRoutableEntryPreview(entry, indexById);
  }

  if (isIndexedEntryInCollection(entry, "authors")) {
    return isFullVersion ? getAuthor(entry) : getAuthorPreview(entry);
  }

  return isIndexedEntryInCollection(entry, "blogroll")
    ? getBlog(entry, indexById)
    : getBookmark(entry, indexById);
}
