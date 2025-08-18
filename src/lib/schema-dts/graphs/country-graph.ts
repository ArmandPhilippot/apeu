import type { Country } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import type { AvailableLocale } from "../../../types/tokens";
import type { COUNTRY_CODES } from "../../../utils/constants";
import { toLowerCase } from "../../../utils/strings";

/**
 * Retrieve a Country graph from a code.
 *
 * @param {(typeof COUNTRY_CODES)[number]} code - A valid country code.
 * @param {AvailableLocale} locale - Used to translate the country name.
 * @returns {Country} A graph representing the Country.
 */
export const getCountryGraph = (
  code: (typeof COUNTRY_CODES)[number],
  locale: AvailableLocale
): Country => {
  const { translate } = useI18n(locale);

  return {
    "@type": "Country",
    alternateName: code,
    name: translate(`meta.value.country.name.${toLowerCase(code)}`),
  };
};
