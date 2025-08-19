import type { Bookmark } from "../../../../types/data";
import type { IndexedEntry } from "../types";
import type { EntryByIdIndex } from "../indexes";
import { getTagsFromReferences } from "./utils";

/**
 * Convert a bookmark collection entry to a Bookmark object.
 *
 * @param {IndexedEntry<"bookmarks">} bookmark - The bookmark collection entry.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {Bookmark} An object describing the bookmark.
 */
export const getBookmark = (
  bookmark: IndexedEntry<"bookmarks">,
  indexById: EntryByIdIndex
): Bookmark => {
  const { collection, data, id } = bookmark.raw;
  const { meta, ...remainingData } = data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = getTagsFromReferences(tags, indexById);

  return {
    ...remainingData,
    collection,
    id,
    meta: {
      ...remainingMeta,
      tags: resolvedTags,
    },
  };
};
