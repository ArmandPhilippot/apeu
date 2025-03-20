import { render, type CollectionEntry } from "astro:content";
import type { Page, PagePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { isObject } from "../../../../utils/type-checks";
import { resolveTranslations } from "./utils";

/**
 * Convert a page collection entry to a PagePreview object.
 *
 * @param {CollectionEntry<"pages">} page - The page collection entry.
 * @returns {Promise<PagePreview>} An object describing the page preview.
 */
export const getPagePreview = async (
  page: CollectionEntry<"pages">
): Promise<PagePreview> => {
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
          ...(cover.position ? { position: cover.position } : {}),
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
 * Convert a page collection entry to a Page object.
 *
 * @param {CollectionEntry<"pages">} page - The page collection entry.
 * @returns {Promise<Page>} An object describing the page.
 */
export const getPage = async (
  page: CollectionEntry<"pages">
): Promise<Page> => {
  const preview = await getPagePreview(page);
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
