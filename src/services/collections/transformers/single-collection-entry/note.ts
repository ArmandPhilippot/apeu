import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getReadMoreCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a note to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"notes", "preview">} entry - A note entry.
 * @param {TransformEntryConfig<"notes">} config - An object containing transform config.
 * @returns {EntryPreview} The converted note.
 */
export const convertNoteToPreview = (
  entry: QueriedEntry<"notes", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showCta,
    showMeta,
  }: TransformEntryConfig<"notes">
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
    description: entry.description,
    featuredMeta,
    isQuote,
    locale,
    meta,
  };
};
