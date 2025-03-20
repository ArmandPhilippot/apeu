import type { Gap } from "../types/css";
import type { Spacing } from "../types/tokens";
import { isNumber, isObject, isString } from "./type-checks";

const isValidCssValue = (
  entry: [string, unknown]
): entry is [string, number | string] => {
  const [_key, value] = entry;
  return isNumber(value) || isString(value);
};

/**
 * Stringify the given CSS variables.
 *
 * This is an alternative to `define:vars` since we can't use this special
 * attribute with dynamic tags. Use this helper on `style` attribute. It is
 * especially useful if some values might be `undefined` or `null`. Otherwise,
 * writing style directly might be better.
 *
 * @param {Record<string, unknown>} cssVars - The CSS variables as object.
 * @returns {string} The CSS variables as string.
 */
export const getCSSVars = (cssVars: Record<string, unknown>): string =>
  Object.entries(cssVars)
    .filter(isValidCssValue)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");

/**
 * Convert a spacing token to a valid CSS value (either `0` or a variable) when
 * the token is defined.
 *
 * @param {Spacing | null | undefined} spacing - The spacing token.
 * @returns {string | 0 | null} The CSS value or null.
 */
export const getSpacingVarValue = (
  spacing: Spacing | null | undefined
): string | 0 | null => {
  if (spacing) return `var(--spacing-${spacing})`;
  if (spacing === undefined) return null;
  return 0;
};

/**
 * Create a CSS value based on a gap configuration.
 *
 * @param {Gap | null | undefined} gap - The gap configuration.
 * @returns {string | 0 | null} The value to use in CSS or null.
 */
export const getSpacingVarFromGap = (
  gap: Gap | null | undefined
): string | 0 | null => {
  if (isObject(gap)) {
    const colGap = gap.col ? getSpacingVarValue(gap.col) : 0;
    const rowGap = gap.row ? getSpacingVarValue(gap.row) : 0;
    return `${rowGap} ${colGap}`;
  } else if (isString(gap)) {
    return getSpacingVarValue(gap);
  }

  return 0;
};
