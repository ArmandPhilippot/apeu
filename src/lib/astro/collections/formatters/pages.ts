import { render, type CollectionEntry } from "astro:content";
import type { Page, PagePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";

export const getPagePreview = async (
  page: CollectionEntry<"pages">,
): Promise<PagePreview> => {
  const { locale, meta, seo, slug, ...remainingData } = page.data;
  const { remarkPluginFrontmatter } = await render(page);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale,
  );

  return {
    ...remainingData,
    collection: page.collection,
    id: page.id,
    locale,
    meta: {
      ...meta,
      readingTime,
    },
  };
};

export const getPage = async (
  page: CollectionEntry<"pages">,
): Promise<Page> => {
  const preview = await getPagePreview(page);
  const { remarkPluginFrontmatter, ...renderResult } = await render(page);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!page.body,
    seo: page.data.seo,
    slug: page.data.slug,
  };
};
