import { join, parse } from "node:path";
import slash from "slash";
import { isAvailableLanguage } from "../services/i18n";
import type { AvailableLanguage } from "../types/tokens";
import { CONFIG } from "./constants";
import { isString } from "./type-checks";

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
 * @param {string} filePath - The file path to evaluate.
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
  const { dir, name: fileName } = parse(slash(filePath));
  return `${dir}/${fileName}`;
};

/**
 * Retrieve a locale from a file path. This fallbacks to the default locale
 * if no locale was found.
 *
 * @param {string} path - The file path.
 * @returns {AvailableLanguage} The computed locale if valid or the default locale.
 */
export const getLocaleFromPath = (path: string): AvailableLanguage => {
  // Get each `/[locale]/` directory encountered.
  const regex = new RegExp(
    `(?<=\\/)(?:${CONFIG.LANGUAGES.AVAILABLE.join("|")})(?=\\/|$)`,
    "g"
  );
  const result = path.match(regex);
  const currentLocale = result === null ? null : result[0];

  return isString(currentLocale) && isAvailableLanguage(currentLocale)
    ? currentLocale
    : CONFIG.LANGUAGES.DEFAULT;
};

/**
 * Returns cumulative path steps for a given path.
 *
 * @example "/en/blog/posts" → ["/en", "/en/blog", "/en/blog/posts"]
 * @param {string} path - The path to parse.
 * @returns {string[]} An array of cumulative paths.
 */
export const getCumulativePaths = (path: string): string[] => {
  const parts = path.split("/").filter((part) => part !== "");
  const steps: string[] = [];

  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    steps.push(current);
  }

  return steps;
};
