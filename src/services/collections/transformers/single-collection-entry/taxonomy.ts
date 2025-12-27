import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getDiscoverCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a blog category or tag to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"blog.categories" | "tags", "preview">} entry - The blog category or tag.
 * @param {TransformEntryConfig<"blog.categories" | "tags">} config - An object containing transform config.
 * @returns {EntryPreview} The converted blog category or tag.
 */
export const convertTaxonomyToPreview = (
  entry: QueriedEntry<"blog.categories" | "tags", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showCover,
    showCta,
    showMeta,
  }: TransformEntryConfig<"blog.categories" | "tags">
): EntryPreview => {
  const actions = buildPreviewActions({
    cta: [getDiscoverCTA({ i18n, route: entry.route, title: entry.title })],
    heading: entry.title,
    showCta,
    url: entry.route,
  });
  const { featuredMeta, meta } = transformEntryMeta(entry, {
    featuredMetaItem,
    i18n,
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
