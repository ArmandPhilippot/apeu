import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getReadMoreCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a guide to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"guides", "preview">} entry - A guide entry.
 * @param {TransformEntryConfig<"guides">} config - An object containing transform config.
 * @returns {EntryPreview} The converted guide.
 */
export const convertGuideToPreview = (
  entry: QueriedEntry<"guides", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showAuthorsIfAvailable,
    showCover,
    showCta,
    showMeta,
  }: TransformEntryConfig<"guides">
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
