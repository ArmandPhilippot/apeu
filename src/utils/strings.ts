/**
 * Capitalize the first letter of the given string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Get a lower cased version of the given string.
 *
 * @template T
 * @param {T} str - Any string.
 * @returns {Lowercase<T>} The lower-cased string.
 */
export const toLowerCase = <T extends string>(str: T): Lowercase<T> =>
  str.toLowerCase() as Lowercase<T>;

/**
 * Get an upper cased version of the given string.
 *
 * @template T
 * @param {T} str - Any string.
 * @returns {Lowercase<T>} The upper-cased string.
 */
export const toUpperCase = <T extends string>(str: T): Uppercase<T> =>
  str.toUpperCase() as Uppercase<T>;

/**
 * Remove the trailing slash from a string.
 *
 * @param {string} str - A string.
 * @returns {string} The string without trailing slash.
 */
export const removeTrailingSlash = (str: string): string => {
  if (!str.endsWith("/")) return str;
  return str.replaceAll(/\/+$/g, "");
};
