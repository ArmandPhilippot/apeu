import type { AvailableLanguage } from "../../types/tokens";
import { CONFIG } from "../../utils/constants";
import { isAvailableLocale, isString } from "../../utils/type-guards";

/**
 * Retrieve the current locale from an unknown locale.
 *
 * `Astro.currentLocale` type is `string | undefined`. This means if we want to
 * use the locale as function parameter we need to accept `undefined` as well.
 * This is not ideal. So we need an helper that fallback to the default locale
 * if `undefined`.
 *
 * @param {string | undefined} locale - Maybe a valid locale.
 * @returns {AvailableLanguage} A valid locale.
 */
export const getCurrentLocale = (
  locale: string | undefined
): AvailableLanguage => {
  if (isString(locale) && isAvailableLocale(locale)) return locale;

  return CONFIG.LANGUAGES.DEFAULT;
};

/**
 * Checks if the route is localized by matching the first segment.
 *
 * @param {string} route - The route to test.
 * @returns {boolean} True if the route starts with a supported locale.
 */
export const isLocalizedRoute = (route: string): boolean => {
  const [_, firstSegment] = route.split("/");
  return isAvailableLocale(firstSegment ?? "");
};
