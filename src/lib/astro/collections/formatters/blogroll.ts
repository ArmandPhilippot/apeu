import type { CollectionEntry } from "astro:content";
import type { Blog } from "../../../../types/data";
import { getTagsFromReferences } from "./utils";

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
