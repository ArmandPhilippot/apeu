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
