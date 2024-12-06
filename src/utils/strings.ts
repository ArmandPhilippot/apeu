/**
 * Capitalize the first letter of the given string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const toLowerCase = <T extends string>(str: T) =>
  str.toLowerCase() as Lowercase<T>;

export const toUpperCase = <T extends string>(str: T) =>
  str.toUpperCase() as Uppercase<T>;
