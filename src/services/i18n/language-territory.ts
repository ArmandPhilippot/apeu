import type { AvailableLocale } from "../../types/tokens";
import type { LooseAutocomplete } from "../../types/utilities";
import { CONFIG } from "../../utils/constants";

/**
 * Retrieve a `language_TERRITORY` code for a locale.
 *
 * @param {LooseAutocomplete<AvailableLocale> | null | undefined} locale - The current locale.
 * @returns {string} The language territory code.
 * @throws {Error} When the locale is not supported.
 */
export const getLanguageTerritory = (
  locale: LooseAutocomplete<AvailableLocale> | null | undefined = CONFIG
    .LANGUAGES.DEFAULT
): string => {
  switch (locale) {
    case "en":
      return "en_US";
    case "fr":
      return "fr_FR";
    default:
      throw new Error(`Locale not supported. Received: ${locale}`);
  }
};
