import { COUNTRY_CODES, LANGUAGE_CODES } from "./constants";

export type CountryCode = (typeof COUNTRY_CODES)[number];

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
