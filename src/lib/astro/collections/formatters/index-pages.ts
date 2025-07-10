import { render, type CollectionEntry } from "astro:content";
import type { IndexPage, IndexPagePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { isObject } from "../../../../utils/type-checks";
import { resolveTranslations } from "./utils";

/**
 * Convert a page collection entry to an IndexPagePreview object.
 *
 * @param {CollectionEntry<"index.pages">} page - The page collection entry.
 * @returns {Promise<IndexPagePreview>} An object describing the page preview.
 */
export const getIndexPagePreview = async (
  page: CollectionEntry<"index.pages">
): Promise<IndexPagePreview> => {
  const { cover, locale, meta, seo, slug, ...remainingData } = page.data;
  const { remarkPluginFrontmatter } = await render(page);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

  return {
    ...remainingData,
    cover: isObject(cover)
      ? {
          ...(cover.position === undefined ? {} : { position: cover.position }),
          src: cover.src,
        }
      : null,
    collection: page.collection,
    id: page.id,
    locale,
    meta: {
      ...meta,
      readingTime,
    },
  };
};

/**
 * Convert a page collection entry to an IndexPage object.
 *
 * @param {CollectionEntry<"index.pages">} page - The page collection entry.
 * @returns {Promise<IndexPage>} An object describing the page.
 */
export const getIndexPage = async (
  page: CollectionEntry<"index.pages">
): Promise<IndexPage> => {
  const preview = await getIndexPagePreview(page);
  const { remarkPluginFrontmatter, ...renderResult } = await render(page);
  const altLanguages = await resolveTranslations(page.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: page.body !== undefined && page.body !== "",
    seo: {
      ...page.data.seo,
      languages: altLanguages,
    },
    slug: page.data.slug,
  };
};
