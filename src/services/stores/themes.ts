import type { Theme } from "../../types/tokens";

/**
 * Retrieve the preferred color scheme from the user's system preferences.
 *
 * @returns {Exclude<Theme, 'auto'>} Either `dark` or `light`.
 */
export const getPreferredColorScheme = (): Exclude<Theme, "auto"> => {
  if (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- window can be undefined, at least while running Vitest.
    globalThis.window?.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

/**
 * Resolve the current color scheme using user's system preferences if needed.
 *
 * @param {Theme} theme - A theme.
 * @returns {Exclude<Theme, 'auto'>} The resolved color scheme.
 */
export const resolveCurrentColorScheme = (
  theme: Theme
): Exclude<Theme, "auto"> => {
  if (theme === "auto") return getPreferredColorScheme();

  return theme;
};
