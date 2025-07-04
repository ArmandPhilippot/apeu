import { render, type CollectionEntry } from "astro:content";
import type { BlogPost, BlogPostPreview } from "../../../../types/data";
import { getMetaFromRemarkPluginFrontmatter } from "../../../../utils/frontmatter";
import { isObject } from "../../../../utils/type-checks";
import { getAuthorLink } from "./authors";
import {
  getCategoryFromReference,
  getTagsFromReferences,
  resolveReferences,
  resolveTranslations,
} from "./utils";

/**
 * Convert a blog post collection entry to a BlogPostPreview object.
 *
 * @param {CollectionEntry<"blog.posts">} post - The blog post collection entry.
 * @returns {Promise<BlogPostPreview>} An object describing the blog post preview.
 */
export const getBlogPostPreview = async (
  post: CollectionEntry<"blog.posts">
): Promise<BlogPostPreview> => {
  const { cover, locale, meta, seo, slug, ...postData } = post.data;
  const { authors, category, isDraft, tags, ...postMeta } = meta;
  const resolvedCategory = await getCategoryFromReference(category);
  const resolvedTags = await getTagsFromReferences(tags);
  const { remarkPluginFrontmatter } = await render(post);
  const { readingTime } = getMetaFromRemarkPluginFrontmatter(
    remarkPluginFrontmatter,
    locale
  );

  return {
    ...postData,
    collection: post.collection,
    cover: isObject(cover)
      ? {
          ...(cover.position ? { position: cover.position } : {}),
          src: cover.src,
        }
      : null,
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

/**
 * Convert a blog post collection entry to a BlogPost object.
 *
 * @param {CollectionEntry<"blog.posts">} post - The blog post collection entry.
 * @returns {Promise<BlogPost>} An object describing the blog post.
 */
export const getBlogPost = async (
  post: CollectionEntry<"blog.posts">
): Promise<BlogPost> => {
  const preview = await getBlogPostPreview(post);
  const resolvedAuthors = await resolveReferences(post.data.meta.authors);
  const { remarkPluginFrontmatter, ...renderResult } = await render(post);
  const altLanguages = await resolveTranslations(post.data.i18n);

  return {
    ...preview,
    ...renderResult,
    hasContent: post.body !== undefined && post.body !== "",
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
