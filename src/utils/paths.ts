import { join, normalize, parse, sep } from "node:path";
import slash from "slash";
import type { AvailableLocale } from "../types/tokens";
import { CONFIG } from "./constants";
import { removeTrailingSlashes } from "./strings";
import { isAvailableLocale } from "./type-guards";

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
 * @returns {AvailableLocale} The computed locale if valid or the default locale.
 */
export const getLocaleFromPath = (path: string): AvailableLocale => {
  // Get each `/[locale]/` directory encountered.
  const regex = new RegExp(
    String.raw`(?<=\/)(?:${CONFIG.LANGUAGES.AVAILABLE.join("|")})(?=\/|$)`,
    "g"
  );
  const result = path.match(regex);
  const currentLocale = result === null ? null : result[0];

  return typeof currentLocale === "string" && isAvailableLocale(currentLocale)
    ? currentLocale
    : CONFIG.LANGUAGES.DEFAULT;
};

/**
 * Split the given path intro an array of substrings.
 *
 * @param {string} path - The path to split.
 * @returns {string[]} The path parts.
 */
export const splitPath = (path: string): string[] => {
  if (path === "") return [];
  return normalize(path).split(sep).filter(Boolean);
};

/**
 * Returns cumulative path steps for a given path.
 *
 * @example "/en/blog/posts" → ["/en", "/en/blog", "/en/blog/posts"]
 * @param {string} path - The path to parse.
 * @returns {string[]} An array of cumulative paths.
 */
export const getCumulativePaths = (path: string): string[] => {
  const parts = splitPath(path);
  const steps: string[] = [];

  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    steps.push(current);
  }

  return steps;
};

/**
 * Remove the trailing slash from a route while collapsing an empty result back
 * to the root route.
 *
 * @example "/blog/" -> "/blog", "/" -> "/"
 * @param {string} route - A route to normalize.
 * @returns {string} The route without a trailing slash.
 */
export const withoutTrailingSlash = (route: string): string =>
  removeTrailingSlashes(route) || "/";

/**
 * Add a trailing slash to a route, unless it already has one.
 *
 * @example "/blog" -> "/blog/", "/blog/" -> "/blog/"
 * @param {string} route - A route to normalize.
 * @returns {string} The route with a trailing slash.
 */
export const withTrailingSlash = (route: string): string =>
  route.endsWith("/") ? route : `${route}/`;

/**
 * Strip a route's outer slashes: the leading slash and, except for the root
 * route, the trailing one. Slashes between segments are left untouched.
 *
 * @example "/blog/posts/" -> "blog/posts", "/" -> ""
 * @param {string} route - A route to convert. Must start with "/".
 * @returns {string} The route without its outer slashes.
 * @throws {Error} If the route doesn't start with a slash.
 */
export const withoutOuterSlashes = (route: string): string => {
  if (!route.startsWith("/")) {
    throw new Error(`Expected a route starting with "/", received: "${route}"`);
  }

  return withoutTrailingSlash(route).slice(1);
};

/**
 * Convert a route into the value expected by an Astro rest param, such as the
 * `page` param of `[...page]`. Unlike `withoutOuterSlashes`, the root route
 * becomes `undefined` rather than an empty string.
 *
 * @example "/blog/posts/" -> "blog/posts", "/" -> undefined
 * @param {string} route - A route to convert.
 * @returns {string | undefined} The route as a rest-param value.
 */
export const routeToStaticPathParam = (route: string): string | undefined =>
  withoutOuterSlashes(route) || undefined;
