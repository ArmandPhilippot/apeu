import { HOME_ID_SEGMENT } from "../../utils/constants";
import { isDefaultLocale } from "../../utils/type-guards";

/**
 * Retrieve the id of the home entry for the given locale (e.g. `en/home`).
 *
 * @param {string} locale - The locale whose home entry id to build.
 * @returns {string} A string in the form `${locale}/home`.
 */
export const getHomeEntryId = (locale: string): string =>
  `${locale}/${HOME_ID_SEGMENT}`;

/**
 * Check if the given entry id is the home entry for the given locale.
 *
 * @param {string} id - The entry id to test.
 * @param {string} locale - The locale to test the id against.
 * @returns {boolean} True if the id is the home entry id for the locale.
 */
export const isHomeEntryId = (id: string, locale: string): boolean =>
  id === getHomeEntryId(locale);

/**
 * Retrieve the home page slug used in routes and OG image paths, where the
 * default locale's home page drops its locale prefix (e.g. `home` for the
 * default locale, `en/home` otherwise).
 *
 * @param {string} locale - The locale to resolve the home page slug for.
 * @returns {string} The home page slug.
 */
export const getOgHomeSlug = (locale: string): string =>
  isDefaultLocale(locale) ? HOME_ID_SEGMENT : getHomeEntryId(locale);
