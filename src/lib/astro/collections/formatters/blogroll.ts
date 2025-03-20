import type { CollectionEntry } from "astro:content";
import type { Blog } from "../../../../types/data";
import { getTagsFromReferences } from "./utils";

/**
 * Convert a blogroll collection entry to a Blog object.
 *
 * @param {CollectionEntry<"blogroll">} blog - The blogroll collection entry.
 * @returns {Promise<Blog>} An object describing a blog.
 */
export const getBlog = async ({
  collection,
  data,
  id,
}: CollectionEntry<"blogroll">): Promise<Blog> => {
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
