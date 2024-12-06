import type { RemarkPluginFrontmatterMeta } from "../types/data";
import type { AvailableLanguage } from "./i18n";
import { getReadingTime } from "./reading-time";
import { isNumber } from "./type-checks";

/**
 * Retrieve the meta from Astro's remarkPluginFrontmatter.
 *
 * @param {Record<string, unknown>} remarkPluginFrontmatter - The frontmatter
 * @param {AvailableLanguage} locale - The current locale
 * @returns {RemarkPluginFrontmatterMeta} The meta stored in the frontmatter.
 */
export const getMetaFromRemarkPluginFrontmatter = (
  remarkPluginFrontmatter: Record<string, unknown>,
  locale: AvailableLanguage,
): RemarkPluginFrontmatterMeta => {
  const readingTime = isNumber(remarkPluginFrontmatter.wordsCount)
    ? getReadingTime(remarkPluginFrontmatter.wordsCount, locale)
    : undefined;

  return {
    readingTime,
  };
};
