import type { Theme } from "../types/tokens";

/**
 * Check if the given value is a valid theme.
 *
 * @param {unknown} value - A value to test.
 * @returns {boolean} True if the value is a valid theme.
 */
export const isValidTheme = (value: unknown): value is Theme => {
  const validThemes: string[] = ["auto", "dark", "light"] satisfies Theme[];

  return typeof value === "string" && validThemes.includes(value);
};

/**
 * Retrieve the preferred color scheme from the user's system preferences.
 *
 * @returns {Exclude<Theme, 'auto'>} Either `dark` or `light`.
 */
export const getPreferredColorScheme = (): Exclude<Theme, "auto"> => {
  if (
    typeof window !== "undefined" &&
    matchMedia("(prefers-color-scheme: dark)").matches
  )
    return "dark";

  return "light";
};

/**
 * Resolve the current color scheme using user's system preferences if needed.
 *
 * @param {Theme} theme - A theme.
 * @returns {Exclude<Theme, 'auto'>} The resolved color scheme.
 */
export const resolveCurrentColorScheme = (
  theme: Theme,
): Exclude<Theme, "auto"> => {
  if (theme === "auto") return getPreferredColorScheme();

  return theme;
};
