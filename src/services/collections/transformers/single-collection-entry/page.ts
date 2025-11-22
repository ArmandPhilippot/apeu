import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getReadMoreCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a page or index page to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"pages" | "index.pages", "preview">} entry - The page or index page.
 * @param {TransformEntryConfig<"pages" | "index.pages">} config - An object containing transform config.
 * @returns {EntryPreview} The converted page or index page.
 */
export const convertPageToPreview = (
  entry: QueriedEntry<"pages" | "index.pages", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showCover,
    showCta,
    showMeta,
  }: TransformEntryConfig<"pages" | "index.pages">
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
