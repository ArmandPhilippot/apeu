import type { Country } from "schema-dts";
import type { COUNTRY_CODES } from "../../../utils/constants";
import { useI18n, type AvailableLanguage } from "../../../utils/i18n";
import { toLowerCase } from "../../../utils/strings";

/**
 * Retrieve a Country graph from a code.
 *
 * @param {(typeof COUNTRY_CODES)[number]} code - A valid country code.
 * @param {AvailableLanguage} locale - Used to translate the country name.
 * @returns {Country} A graph representing the Country.
 */
export const getCountryGraph = (
  code: (typeof COUNTRY_CODES)[number],
  locale: AvailableLanguage
): Country => {
  const { translate } = useI18n(locale);

  return {
    "@type": "Country",
    alternateName: code,
    name: translate(`meta.value.country.name.${toLowerCase(code)}`),
  };
};
