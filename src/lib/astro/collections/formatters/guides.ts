import { render, type CollectionEntry } from "astro:content";
import type { Guide, GuidePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { isObject } from "../../../../utils/type-checks";
import { getAuthorLink } from "./authors";
import {
  getTagsFromReferences,
  resolveReferences,
  resolveTranslations,
} from "./utils";

/**
 * Convert a guide collection entry to a GuidePreview object.
 *
 * @param {CollectionEntry<"guides">} guide - The guide collection entry.
 * @returns {Promise<GuidePreview>} An object describing the guide preview.
 */
export const getGuidePreview = async (
  guide: CollectionEntry<"guides">
): Promise<GuidePreview> => {
  const { cover, locale, meta, seo, slug, ...remainingData } = guide.data;
  const { authors, isDraft, tags, ...remainingMeta } = meta;
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(guide);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

  return {
    ...remainingData,
    cover: isObject(cover)
      ? {
          ...(cover.position ? { position: cover.position } : {}),
          src: cover.src,
        }
      : null,
    collection: guide.collection,
    id: guide.id,
    locale,
    meta: {
      ...remainingMeta,
      readingTime,
      tags: resolvedTags,
    },
  };
};

/**
 * Convert a guide collection entry to a Guide object.
 *
 * @param {CollectionEntry<"guides">} guide - The guide collection entry.
 * @returns {Promise<Guide>} An object describing the guide.
 */
export const getGuide = async (
  guide: CollectionEntry<"guides">
): Promise<Guide> => {
  const preview = await getGuidePreview(guide);
  const resolvedAuthors = await resolveReferences(guide.data.meta.authors);
  const { remarkPluginFrontmatter, ...renderResult } = await render(guide);
  const altLanguages = await resolveTranslations(guide.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: guide.body !== undefined && guide.body !== "",
    meta: {
      ...preview.meta,
      authors: resolvedAuthors?.map(getAuthorLink) ?? [],
    },
    seo: {
      ...guide.data.seo,
      languages: altLanguages,
    },
    slug: guide.data.slug,
  };
};
