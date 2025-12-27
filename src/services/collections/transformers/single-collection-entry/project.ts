import type { EntryPreview } from "../../../../types/data";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getDiscoverCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

/**
 * Convert a project to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"projects", "preview">} entry - A project entry.
 * @param {TransformEntryConfig<"projects">} config - An object containing transform config.
 * @returns {EntryPreview} The converted project.
 */
export const convertProjectToPreview = (
  entry: QueriedEntry<"projects", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showCover,
    showCta,
    showMeta,
  }: TransformEntryConfig<"projects">
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
