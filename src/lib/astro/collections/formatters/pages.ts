import { render, type CollectionEntry } from "astro:content";
import type { Page, PagePreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { resolveTranslations } from "./utils";

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
  const altLanguages = await resolveTranslations(page.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!page.body,
    seo: {
      ...page.data.seo,
      languages: altLanguages,
    },
    slug: page.data.slug,
  };
};
