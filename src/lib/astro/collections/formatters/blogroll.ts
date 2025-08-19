import type { Blog } from "../../../../types/data";
import type { IndexedEntry } from "../types";
import type { EntryByIdIndex } from "../indexes";
import { getTagsFromReferences } from "./utils";

/**
 * Convert a blogroll collection entry to a formatted blogroll object.
 *
 * @param {IndexedEntry<"blogroll">} blog - The blogroll collection entry.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {Blog} An object describing a blog.
 */
export const getBlog = (
  blog: IndexedEntry<"blogroll">,
  indexById: EntryByIdIndex
): Blog => {
  const { collection, data, id } = blog.raw;
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
