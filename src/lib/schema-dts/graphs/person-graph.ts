import type { Person } from "schema-dts";
import type { Author } from "../../../types/data";
import type { AvailableLanguage } from "../../../utils/i18n";
import { getImgSrc } from "../../../utils/images";
import { getWebsiteUrl } from "../../../utils/url";
import { getCountryGraph } from "./country-graph";
import { getLanguageGraph } from "./language-graph";

/**
 * Retrieve a Person graph describing the given author.
 *
 * @param {Partial<Author> & Pick<Author, "name">} author - The data.
 * @param {AvailableLanguage} locale - The current locale.
 * @returns {Promise<Person>} The Person graph.
 */
export const getPersonGraph = async (
  author: Partial<Author> & Pick<Author, "name">,
  locale: AvailableLanguage,
): Promise<Person> => {
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;

  return {
    "@type": "Person",
    ...(author.isWebsiteOwner && { "@id": websiteAuthor }),
    ...(author.lastName && { familyName: author.lastName }),
    ...(author.firstName && { givenName: author.firstName }),
    ...(author.avatar && { image: await getImgSrc(author.avatar) }),
    ...(author.job && { jobTitle: author.job }),
    ...(author.spokenLanguages?.length && {
      knowsLanguage: author.spokenLanguages.map((language) =>
        getLanguageGraph(language, locale),
      ),
    }),
    name: author.name,
    ...(author.nationality && {
      nationality: getCountryGraph(author.nationality, locale),
    }),
    ...(author.website && { url: author.website }),
  };
};
