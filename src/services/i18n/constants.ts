import type { AvailableLanguage } from "../../types/tokens";

export const availableNamedLanguages = {
  en: "English",
  fr: "Français",
} as const satisfies Record<AvailableLanguage, string>;
