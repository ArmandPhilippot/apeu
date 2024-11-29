import { render, type CollectionEntry } from "astro:content";
import type { Page, PagePreview } from "../../../../types/data";

export const getPagePreview = async ({
  collection,
  data,
  id,
}: CollectionEntry<"pages">): Promise<PagePreview> => {
  const { meta, seo, slug, ...remainingData } = data;

  return {
    ...remainingData,
    collection,
    id,
    meta,
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
