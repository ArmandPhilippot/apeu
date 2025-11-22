import type { EntryPreview } from "../../../../types/data";
import { CONFIG } from "../../../../utils/constants";
import { isAvailableLocale } from "../../../../utils/type-guards";
import type { QueriedEntry } from "../../types";
import {
  buildPreviewActions,
  getOpenFeedCTA,
  getOpenWebsiteCTA,
  transformEntryMeta,
} from "../helpers";
import type { TransformEntryConfig } from "../types";

const getLocalizedDescription = (
  desc: QueriedEntry<"blogroll", "preview">["description"],
  locale: string | null | undefined
) => desc[isAvailableLocale(locale) ? locale : CONFIG.LANGUAGES.DEFAULT] ?? "";

/**
 * Convert a blog to a format suitable for PreviewCard.
 *
 * @param {QueriedEntry<"blogroll", "preview">} entry - A blog entry.
 * @param {TransformEntryConfig<"blogroll">} config - An object containing transform config.
 * @returns {EntryPreview} The converted blog.
 */
export const convertBlogToPreview = (
  entry: QueriedEntry<"blogroll", "preview">,
  {
    featuredMetaItem,
    i18n,
    isQuote,
    locale,
    showCta,
    showMeta,
  }: TransformEntryConfig<"blogroll">
): EntryPreview => {
  const actions = buildPreviewActions({
    cta: [
      getOpenWebsiteCTA(entry.url, i18n),
      entry.feed === undefined ? null : getOpenFeedCTA(entry.feed, i18n),
    ].filter((cta) => cta !== null),
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
    description: getLocalizedDescription(entry.description, locale),
    featuredMeta,
    isQuote,
    locale,
    meta,
  };
};
