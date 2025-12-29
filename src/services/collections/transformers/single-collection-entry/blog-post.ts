import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getReadMoreCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a blog post to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"blog.posts", "preview">} entry - A blog post entry.
 * @param {TransformEntryConfig<"blog.posts">} config - An object containing transform config.
 * @returns {EntryPreview} The converted blog post.
 */
export const convertBlogPostToPreview = (
  entry: QueriedEntry<"blog.posts", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showAuthorsIfAvailable,
    showCover,
    showCta,
    showMeta,
  }: TransformEntryConfig<"blog.posts">
): EntryPreview => {
  const actions = buildPreviewActions({
    cta: [getReadMoreCTA({ i18n, route: entry.route, title: entry.title })],
    heading: entry.title,
    showCta,
    url: entry.route,
  });
  const { featuredMeta, meta } = transformEntryMeta(entry, {
    featuredMetaItem,
    i18n,
    showAuthorsIfAvailable,
    showMeta,
  });

  return {
    ...actions,
    cover: showCover === true ? entry.cover : null,
    description: entry.description,
    featuredMeta,
    isQuote,
    locale,
    meta,
  };
};
