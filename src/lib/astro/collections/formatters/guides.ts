import { render, type CollectionEntry } from "astro:content";
import type { Guide, GuidePreview } from "../../../../types/data";
import { getAuthorLink } from "./authors";
import { getTagsFromReferences, resolveReferences } from "./utils";

export const getGuidePreview = async ({
  collection,
  data,
  id,
}: CollectionEntry<"guides">): Promise<GuidePreview> => {
  const { meta, seo, slug, ...remainingData } = data;
  const { authors, isDraft, tags, ...remainingMeta } = meta;
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

export const getGuide = async (
  guide: CollectionEntry<"guides">,
): Promise<Guide> => {
  const preview = await getGuidePreview(guide);
  const resolvedAuthors = await resolveReferences(guide.data.meta.authors);
  const { remarkPluginFrontmatter, ...renderResult } = await render(guide);

  return {
    ...preview,
    ...renderResult,
    meta: {
      ...preview.meta,
      authors: resolvedAuthors?.map(getAuthorLink) ?? [],
    },
    seo: guide.data.seo,
    slug: guide.data.slug,
  };
};
