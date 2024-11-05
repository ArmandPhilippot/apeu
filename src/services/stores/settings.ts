import { persistentMap } from "@nanostores/persistent";
import type { Theme } from "../../types/tokens";

export type Settings = {
  theme: Theme;
};

export const THEME_DEFAULT = "auto" as const satisfies Theme;

/* The value should match the key used for theme in `settings`. */
export const THEME_SETTING_KEY = "theme";

export const settings = persistentMap<Settings>(
  "settings:",
  {
    theme: THEME_DEFAULT,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
    listen: true,
  },
);

/**
 * Check if the given value is a valid settings key.
 *
 * @param {unknown} value - Any value.
 * @returns {boolean} True if the value is a valid key.
 */
export const isValidSettingsKey = (value: unknown): value is keyof Settings => {
  const validKeys: string[] = [THEME_SETTING_KEY] satisfies (keyof Settings)[];

  return typeof value === "string" && validKeys.includes(value);
};
