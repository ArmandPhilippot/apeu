import type { CalloutType } from "../types/tokens";
import { CALLOUT_TYPES } from "./constants";
import { isString } from "./type-checks";

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
