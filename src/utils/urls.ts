import { CONFIG } from "./constants";

/**
 * Check if the given path matches the homepage for any supported locale.
 *
 * @param {string} path - The path the check.
 * @returns {boolean} True if the path matches the homepage.
 */
export const isHomePage = (path: string) =>
  path === "/" ||
  CONFIG.LANGUAGES.AVAILABLE.some((lang) => path === `/${lang}`);
