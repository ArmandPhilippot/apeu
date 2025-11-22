import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getReadMoreCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a bookmark to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"bookmarks", "preview">} entry - A bookmark entry.
 * @param {TransformEntryConfig<"bookmarks">} config - An object containing transform config.
 * @returns {EntryPreview} The converted bookmark.
 */
export const convertBookmarkToPreview = (
  entry: QueriedEntry<"bookmarks", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showCta,
    showMeta,
  }: TransformEntryConfig<"bookmarks">
): EntryPreview => {
  const actions = buildPreviewActions({
    cta: [
      getReadMoreCTA({
        i18n,
        isExternal: true,
        route: entry.url,
        title: entry.title,
      }),
    ],
    heading: entry.title,
    showCta,
    url: entry.url,
  });
  const { featuredMeta, meta } = transformEntryMeta(entry, {
    featuredMetaItem,
    i18n,
    showMeta,
  });

  return {
    ...actions,
    description: entry.description,
    featuredMeta,
    isQuote,
    locale,
    meta,
  };
};
