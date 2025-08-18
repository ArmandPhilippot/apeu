import { persistentMap } from "@nanostores/persistent";
import { atom, computed } from "nanostores";
import type { Theme } from "../../types/tokens";
import { isString } from "../../utils/type-guards";
import { getPreferredColorScheme, resolveCurrentColorScheme } from "./themes";

export type Settings = {
  shiki: Theme;
  theme: Theme;
};

export const SETTING_KEYS = {
  SHIKI: "shiki",
  THEME: "theme",
} as const;

export const SETTING_DEFAULTS = {
  [SETTING_KEYS.SHIKI]: "auto",
  [SETTING_KEYS.THEME]: "auto",
} as const;

/**
 * Retrieve the default value for the given setting key.
 *
 * @param {keyof Settings} key - The settings key.
 * @returns {Theme} The default value.
 */
export const getSettingDefault = (key: keyof Settings): Theme =>
  SETTING_DEFAULTS[key];

export const settings = persistentMap<Settings>(
  "apeu-settings:",
  {
    [SETTING_KEYS.SHIKI]: SETTING_DEFAULTS[SETTING_KEYS.SHIKI],
    [SETTING_KEYS.THEME]: SETTING_DEFAULTS[SETTING_KEYS.THEME],
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
export const isValidSettingsKey = (value: unknown): value is keyof Settings =>
  isString(value) && Object.values<string>(SETTING_KEYS).includes(value);

/**
 * Atom that tracks system color scheme preference.
 */
export const systemColorScheme = atom<Exclude<Theme, "auto">>(
  getPreferredColorScheme()
);

/**
 * Update the value stored for the system color scheme.
 */
export const updateSystemColorScheme = () => {
  systemColorScheme.set(getPreferredColorScheme());
};

/**
 * The actual theme, considering system preferences.
 */
export const activeTheme = computed(
  [settings, systemColorScheme],
  (activeSettings, systemTheme) =>
    activeSettings.theme === "auto" ? systemTheme : activeSettings.theme
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
