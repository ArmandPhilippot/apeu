import type { Language } from "schema-dts";
import type { LANGUAGE_CODES } from "../../../utils/constants";
import { useI18n, type AvailableLanguage } from "../../../utils/i18n";

/**
 * Retrieve a Language graph from a code.
 *
 * @param {(typeof LANGUAGE_CODES)[number]} code - The language code.
 * @param {AvailableLanguage} locale - Used to translate the language name.
 * @returns {Language} The language graph.
 */
export const getLanguageGraph = (
  code: (typeof LANGUAGE_CODES)[number],
  locale: AvailableLanguage,
): Language => {
  const { translate } = useI18n(locale);

  return {
    "@type": "Language",
    alternateName: code,
    name: translate(`language.name.${code}`),
  };
};
