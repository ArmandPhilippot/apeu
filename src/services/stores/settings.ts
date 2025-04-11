import { persistentMap } from "@nanostores/persistent";
import { computed } from "nanostores";
import type { Theme } from "../../types/tokens";
import { resolveCurrentColorScheme } from "../../utils/themes";

export type Settings = {
  shiki: Theme;
  theme: Theme;
};

export const SHIKI_DEFAULT = "auto" as const satisfies Theme;
export const THEME_DEFAULT = "auto" as const satisfies Theme;

/* The value should match the key used for shiki in `settings`. */
export const SHIKI_SETTING_KEY = "shiki";
/* The value should match the key used for theme in `settings`. */
export const THEME_SETTING_KEY = "theme";

export const settings = persistentMap<Settings>(
  "apeu-settings:",
  {
    shiki: SHIKI_DEFAULT,
    theme: THEME_DEFAULT,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
    listen: true,
  }
);

/**
 * Check if the given value is a valid settings key.
 *
 * @param {unknown} value - Any value.
 * @returns {boolean} True if the value is a valid key.
 */
export const isValidSettingsKey = (value: unknown): value is keyof Settings => {
  const validKeys: string[] = [
    SHIKI_SETTING_KEY,
    THEME_SETTING_KEY,
  ] satisfies (keyof Settings)[];

  return typeof value === "string" && validKeys.includes(value);
};

/**
 * The actual theme, considering system preferences.
 */
export const activeTheme = computed(settings, (activeSettings) =>
  resolveCurrentColorScheme(activeSettings.theme)
);

/**
 * The actual theme for code blocks, considering global theme and system
 * preferences.
 */
export const activeShikiTheme = computed(
  [settings, activeTheme],
  (activeSettings, mainTheme) =>
    activeSettings.shiki === "auto"
      ? mainTheme
      : resolveCurrentColorScheme(activeSettings.shiki)
);
