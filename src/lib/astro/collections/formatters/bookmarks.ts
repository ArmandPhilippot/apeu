import type { CollectionEntry } from "astro:content";
import type { Bookmark } from "../../../../types/data";
import { getTagsFromReferences } from "./utils";

/**
 * Convert a bookmark collection entry to a Bookmark object.
 *
 * @param {CollectionEntry<"bookmarks">} bookmark - The bookmark collection entry.
 * @returns {Promise<Bookmark>} An object describing the bookmark.
 */
export const getBookmark = async ({
  collection,
  data,
  id,
}: CollectionEntry<"bookmarks">): Promise<Bookmark> => {
  const { meta, ...remainingData } = data;
  const { isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);

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
