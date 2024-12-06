/**
 * Check if a value is an object.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is an object.
 */
export const isObject = (
  value: unknown,
): value is Record<string | number | symbol, unknown> =>
  value !== null &&
  (value instanceof Object || typeof value === "object") &&
  !Array.isArray(value);

/**
 * Check if a key exists in an object.
 *
 * @param {O} obj - An object.
 * @param {K} key - The expected object key.
 * @returns {boolean} True if the key exists in the object.
 */
export const isKeyExistIn = <O extends object, K extends string>(
  obj: O,
  key: K,
): obj is O & Record<K, unknown> => {
  if (!isObject(obj)) throw new Error("First argument must be an object.");

  return obj[key] !== undefined;
};

/**
 * Check if a value is a number.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is a number.
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

/**
 * Check if a value is a string.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is a string.
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string";
