import { render, type CollectionEntry } from "astro:content";
import type { BlogPost, BlogPostPreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { getAuthorLink } from "./authors";
import {
  getCategoryFromReference,
  getTagsFromReferences,
  resolveReferences,
  resolveTranslations,
} from "./utils";

export const getBlogPostPreview = async (
  post: CollectionEntry<"blogPosts">,
): Promise<BlogPostPreview> => {
  const { locale, meta, seo, slug, ...postData } = post.data;
  const { authors, category, isDraft, tags, ...postMeta } = meta;
  const resolvedCategory = await getCategoryFromReference(category);
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(post);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale,
  );

  return {
    ...postData,
    collection: post.collection,
    id: post.id,
    locale,
    meta: {
      ...postMeta,
      category: resolvedCategory,
      readingTime,
      tags: resolvedTags,
    },
  };
};

export const getBlogPost = async (
  post: CollectionEntry<"blogPosts">,
): Promise<BlogPost> => {
  const preview = await getBlogPostPreview(post);
  const resolvedAuthors = await resolveReferences(post.data.meta.authors);
  const { remarkPluginFrontmatter, ...renderResult } = await render(post);
  const altLanguages = await resolveTranslations(post.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: !!post.body,
    meta: {
      ...preview.meta,
      authors: resolvedAuthors?.map(getAuthorLink) ?? [],
    },
    seo: {
      ...post.data.seo,
      languages: altLanguages,
    },
    slug: post.data.slug,
  };
};
