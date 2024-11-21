import { render, type CollectionEntry } from "astro:content";
import type { BlogPost, BlogPostPreview } from "../../../../types/data";
import { getAuthorLink } from "./authors";
import {
  getCategoryFromReference,
  getTagsFromReferences,
  resolveReferences,
} from "./utils";

export const getBlogPostPreview = async ({
  collection,
  data,
  id,
}: CollectionEntry<"blogPosts">): Promise<BlogPostPreview> => {
  const { meta, seo, slug, ...postData } = data;
  const { authors, category, isDraft, tags, ...postMeta } = meta;
  const resolvedCategory = await getCategoryFromReference(category);
  const resolvedTags = await getTagsFromReferences(tags);

  return {
    ...postData,
    collection,
    id,
    meta: {
      ...postMeta,
      category: resolvedCategory,
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

  return {
    ...preview,
    ...renderResult,
    meta: {
      ...preview.meta,
      authors: resolvedAuthors?.map(getAuthorLink) ?? [],
    },
    seo: post.data.seo,
    slug: post.data.slug,
  };
};
