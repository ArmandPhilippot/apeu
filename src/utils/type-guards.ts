import type {
  AvailableLocale,
  CalloutType,
  CountryCode,
  SocialMedium,
  Theme,
} from "../types/tokens";
import {
  CALLOUT_TYPES,
  CONFIG,
  COUNTRY_CODES,
  LANGUAGE_CODES,
  SOCIAL_MEDIA,
  THEMES,
} from "./constants";

/**
 * Check if a value is an object.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is an object.
 */
export const isObject = (
  value: unknown
): value is Record<string | number | symbol, unknown> =>
  value !== null &&
  (value instanceof Object || typeof value === "object") &&
  !Array.isArray(value);

/**
 * Check if a key exists in an object.
 *
 * @template O, K
 * @param {O} obj - An object.
 * @param {K} key - The expected object key.
 * @returns {boolean} True if the key exists in the object.
 * @throws {Error} When the first argument is not an object.
 */
export const isKeyExistIn = <O extends object, K extends string>(
  obj: O,
  key: K
): obj is O & Record<K, unknown> => {
  if (!isObject(obj)) throw new Error("First argument must be an object.");

  return obj[key] !== undefined;
};

/**
 * Check if a value is a number.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is a number.
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/**
 * Check if a value is a string.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is a string.
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/**
 * Check if the given locale is an available locale.
 *
 * @param {string} locale - The locale to validate.
 * @returns {boolean} True if it is a valid locale.
 */
export const isAvailableLocale = (locale: string): locale is AvailableLocale =>
  (CONFIG.LANGUAGES.AVAILABLE as readonly string[]).includes(locale);

/**
 * Check if the given locale is the default one.
 *
 * @param {string} locale - A locale.
 * @returns {boolean} True if it is the default locale.
 */
export const isDefaultLocale = (
  locale: string
): locale is typeof CONFIG.LANGUAGES.DEFAULT =>
  locale === CONFIG.LANGUAGES.DEFAULT;

/**
 * Check if the given value matches a callout type.
 *
 * @param {unknown} value - Any value.
 * @returns {boolean} True if the value is a callout type.
 */
export const isValidCalloutType = (value: unknown): value is CalloutType => {
  if (!isString(value)) return false;

  return (CALLOUT_TYPES as readonly string[]).includes(value);
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

/**
 * Check if the given medium is a valid social medium.
 *
 * @param {unknown} medium - The medium to validate.
 * @returns {boolean} True if the medium is valid.
 */
export const isValidSocialMedium = (
  medium: unknown
): medium is SocialMedium => {
  if (!isString(medium)) return false;

  return (SOCIAL_MEDIA as readonly string[]).includes(medium);
};

/**
 * Check if the given value is a valid theme.
 *
 * @param {unknown} value - A value to validate.
 * @returns {boolean} True if the value is a valid theme.
 */
export const isValidTheme = (value: unknown): value is Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);
