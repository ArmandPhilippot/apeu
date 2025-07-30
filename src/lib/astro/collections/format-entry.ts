import type {
  CollectionEntry,
  CollectionKey,
  DataEntryMap,
} from "astro:content";
import type { QueryMode } from "../../../types/data";
import type { RoutableCollectionKey } from "../../../types/routing";
import { isRoutableEntry } from "../../../utils/collections";
import { getAuthor, getAuthorPreview } from "./formatters/authors";
import { getBlog } from "./formatters/blogroll";
import { getBookmark } from "./formatters/bookmarks";
import {
  getRoutableEntry,
  getRoutableEntryPreview,
} from "./formatters/routable-entries";

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
  // The DataEntryMap part is required due to the return type of getEntry...
  entry: CollectionEntry<C> | DataEntryMap[C][keyof DataEntryMap[C] & string],
  format?: F
): Promise<ReturnType<FormatEntryReturnMap<F>[C]>>;
export async function formatEntry<
  C extends CollectionKey,
  F extends QueryMode = "full",
>(
  // The DataEntryMap part is required due to the return type of getEntry...
  entry: CollectionEntry<C> | DataEntryMap[C][keyof DataEntryMap[C] & string],
  format?: F
) {
  const isFullVersion = format !== "preview";

  if (isRoutableEntry(entry)) {
    return isFullVersion
      ? getRoutableEntry<typeof entry.collection>(entry)
      : getRoutableEntryPreview<typeof entry.collection>(entry);
  }

  switch (entry.collection) {
    case "authors":
      return isFullVersion ? getAuthor(entry) : getAuthorPreview(entry);
    case "blogroll":
      return getBlog(entry);
    case "bookmarks":
      return getBookmark(entry);
    default:
      throw new Error("Unsupported collection name.");
  }
}
