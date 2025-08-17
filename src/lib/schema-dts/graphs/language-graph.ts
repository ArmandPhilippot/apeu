import type { Language } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import type { AvailableLanguage } from "../../../types/tokens";
import type { LANGUAGE_CODES } from "../../../utils/constants";

/**
 * Retrieve a Language graph from a code.
 *
 * @param {(typeof LANGUAGE_CODES)[number]} code - A valid language code.
 * @param {AvailableLanguage} locale - Used to translate the language name.
 * @returns {Language} A graph representing the language.
 */
export const getLanguageGraph = (
  code: (typeof LANGUAGE_CODES)[number],
  locale: AvailableLanguage
): Language => {
  const { translate } = useI18n(locale);

  return {
    "@type": "Language",
    alternateName: code,
    name: translate(`language.name.${code}`),
  };
};
