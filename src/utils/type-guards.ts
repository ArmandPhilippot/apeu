import type { CalloutType, SocialMedium } from "../types/tokens";
import { CALLOUT_TYPES } from "./constants";

/**
 * Check if a value is an object.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is an object.
 */
export const isObject = (
  value: unknown
): value is Record<string | number | symbol, unknown> =>
  value !== null &&
  (value instanceof Object || typeof value === "object") &&
  !Array.isArray(value);

/**
 * Check if a key exists in an object.
 *
 * @template O, K
 * @param {O} obj - An object.
 * @param {K} key - The expected object key.
 * @returns {boolean} True if the key exists in the object.
 * @throws {Error} When the first argument is not an object.
 */
export const isKeyExistIn = <O extends object, K extends string>(
  obj: O,
  key: K
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

/**
 * Check if the given value matches a callout type.
 *
 * @param {unknown} value - Any value.
 * @returns {boolean} True if the value is a callout type.
 */
export const isValidCalloutType = (value: unknown): value is CalloutType => {
  if (!isString(value)) return false;

  return (CALLOUT_TYPES as readonly string[]).includes(value);
};

/**
 * Check if the given medium is a valid social medium.
 *
 * @param {unknown} medium - The medium to validate.
 * @returns {boolean} True if the medium is valid.
 */
export const isValidSocialMedium = (
  medium: unknown
): medium is SocialMedium => {
  if (typeof medium !== "string") return false;

  const validMedia: string[] = [
    "bluesky",
    "diaspora",
    "email",
    "facebook",
    "github",
    "gitlab",
    "linkedin",
    "mastodon",
    "reddit",
    "stackoverflow",
    "whatsapp",
    "x",
  ] satisfies SocialMedium[];

  return validMedia.includes(medium);
};
