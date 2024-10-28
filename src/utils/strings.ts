/**
 * Capitalize the first letter of the given string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
