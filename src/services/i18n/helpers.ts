import type { AvailableLanguage, CountryCode } from "../../types/tokens";
import { CONFIG, COUNTRY_CODES, LANGUAGE_CODES } from "../../utils/constants";
import { isString } from "../../utils/type-guards";

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

/**
 * Checks if the route is localized by matching the first segment.
 *
 * @param {string} route - The route to test.
 * @returns {boolean} True if the route starts with a supported locale.
 */
export const isLocalizedRoute = (route: string): boolean => {
  const [_, firstSegment] = route.split("/");
  return isAvailableLanguage(firstSegment ?? "");
};

/**
 * Check if the given string is a valid country code.
 *
 * @param {string} code - An ISO 3166-1 alpha-2 code.
 * @returns {boolean} True if the code is valid.
 */
export const isValidCountryCode = (code: string): code is CountryCode =>
  (COUNTRY_CODES as readonly string[]).includes(code);

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

/**
 * Check if the given string is valid language code.
 *
 * @param {string} code - An ISO 639-1 code.
 * @returns {boolean} True if the code is valid.
 */
export const isValidLanguageCode = (code: string): code is LanguageCode =>
  (LANGUAGE_CODES as readonly string[]).includes(code);
