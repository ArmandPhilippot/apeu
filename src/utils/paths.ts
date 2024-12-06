import { join, parse } from "node:path";
import slash from "slash";
import { CONFIG } from "./constants";
import { isAvailableLanguage, type AvailableLanguage } from "./i18n";

/**
 * Retrieve a path with forward slashes from a list of paths to join.
 *
 * This is a wrapper around the `join` function from `node:path`. It handles
 * Windows paths as well by converting them to a path with forward slashes.
 *
 * @param {...string[]} paths - The paths to join.
 * @returns {string} The result path.
 */
export const joinPaths = (...paths: string[]): string => slash(join(...paths));

/**
 * Retrieve the parent directory path from a file path converted to a path with
 * forward slashes.
 *
 * @param {string} filePath - The file path.
 * @returns {string} The parent directory path.
 */
export const getParentDirPath = (filePath: string): string =>
  parse(slash(filePath)).dir;

/**
 * Remove the extension of a file path.
 *
 * @param {string} filePath - A file path.
 * @returns {string} The file path without extension.
 */
export const removeExtFromPath = (filePath: string): string => {
  const { dir, name } = parse(slash(filePath));
  return `${dir}/${name}`;
};

/**
 * Retrieve a locale from a file path. This fallbacks to the default locale
 * if no locale was found.
 *
 * @param {string} path - The file path.
 * @returns {AvailableLanguage} The locale.
 */
export const getLocaleFromPath = (path: string): AvailableLanguage => {
  // Get each `/[locale]/` directory encountered.
  const regex = new RegExp(
    `(?<=\\/)(?:${CONFIG.LANGUAGES.AVAILABLE.join("|")})(?=\\/|$)`,
    "g",
  );
  const result = path.match(regex);
  const currentLocale = result ? result[0] : null;

  return currentLocale && isAvailableLanguage(currentLocale)
    ? currentLocale
    : CONFIG.LANGUAGES.DEFAULT;
};
