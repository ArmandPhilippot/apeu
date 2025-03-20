import type { SharedShape } from "../types/utilities";
import { isString } from "./type-checks";

/**
 * Method to compare two Date. This should be used in `Array.sort()`.
 *
 * @param {Date} a - A Date.
 * @param {Date} b - Another Date.
 * @returns {number} The sort result.
 */
export const compareDates = (a: Date, b: Date): number =>
  a.getTime() - b.getTime();

/**
 * Method to compare two strings. This should be used in `Array.sort()`.
 *
 * @param {string} a - A string.
 * @param {string} b - Another string.
 * @returns {number} The sort result.
 */
export const compareNonAsciiStrings = (a: string, b: string): number =>
  a.localeCompare(b);

/**
 * Method to sort two objects using the value of the given key.
 *
 * @template T1, T2
 * @param {T1} a - An object.
 * @param {T2} b - Another object.
 * @param {keyof SharedShape<T1, T2>} key - A key available in both objects.
 * @returns {number} The sort result.
 * @throws {Error} When the property type is not supported.
 */
export const sortByKey = <T1, T2>(
  a: T1,
  b: T2,
  key: keyof SharedShape<T1, T2>
): number => {
  const valueA = a[key];
  const valueB = b[key];

  if (isString(valueA) && isString(valueB)) {
    return compareNonAsciiStrings(valueA, valueB);
  }

  if (valueA instanceof Date && valueB instanceof Date) {
    return compareDates(valueA, valueB);
  }

  throw new Error(`Unsupported property type for sorting`);
};
