import type { AvailableLanguage } from "../../types/tokens";
import { CONFIG } from "../../utils/constants";
import { isString } from "../../utils/type-checks";

/**
 * Check if the given language is an available language.
 *
 * @param {string} language - The language to validate.
 * @returns {boolean} True if it is a valid language.
 */
export const isAvailableLanguage = (
  language: string
): language is AvailableLanguage =>
  (CONFIG.LANGUAGES.AVAILABLE as readonly string[]).includes(language);

/**
 * Check if the given language is the default one.
 *
 * @param {string} language - A locale.
 * @returns {boolean} True if it is the default language.
 */
export const isDefaultLanguage = (
  language: string
): language is typeof CONFIG.LANGUAGES.DEFAULT =>
  language === CONFIG.LANGUAGES.DEFAULT;

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
  if (isString(locale) && isAvailableLanguage(locale)) return locale;

  return CONFIG.LANGUAGES.DEFAULT;
};
