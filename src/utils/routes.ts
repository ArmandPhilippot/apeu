import { isAvailableLanguage } from "./i18n";

/**
 * Normalizes a route by removing the trailing slash.
 *
 * @param {string} route - The route to format.
 * @returns {string} The normalized route.
 */
export const normalizeRoute = (route: string): string =>
  route.replace(/\/+$/, "") || "/";

/**
 * Returns cumulative path steps for a given route.
 *
 * @example "/en/blog/posts" → ["/en", "/en/blog", "/en/blog/posts"]
 * @param {string} route - The route to parse.
 * @returns {string[]} An array of cumulative paths.
 */
export const getCumulativePaths = (route: string): string[] => {
  const parts = route.split("/").filter((part) => part !== "");
  const steps: string[] = [];

  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    steps.push(current);
  }

  return steps;
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
