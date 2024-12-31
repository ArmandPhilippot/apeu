import type { Gap } from "../types/css";
import type { Spacing } from "../types/tokens";

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
    .filter(([_key, value]) => typeof value !== "undefined" && value !== null)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");

export const getSpacingVarValue = (spacing: Spacing | null | undefined) => {
  if (spacing) return `var(--spacing-${spacing})`;
  if (typeof spacing === "undefined") return null;
  return 0;
};

export const getSpacingVarFromGap = (gap: Gap | null | undefined) => {
  if (!gap) return 0;
  if (typeof gap === "object") {
    const colGap = gap.col ? getSpacingVarValue(gap.col) : 0;
    const rowGap = gap.row ? getSpacingVarValue(gap.row) : 0;
    return `${rowGap} ${colGap}`;
  }
  return getSpacingVarValue(gap);
};
