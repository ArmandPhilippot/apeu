import type { Person } from "schema-dts";
import type { Author } from "../../../types/data";
import type { AvailableLocale } from "../../../types/tokens";
import { WEBSITE_URL } from "../../../utils/constants";
import { getImgSrc } from "../../../utils/images";
import { getCountryGraph } from "./country-graph";
import { getLanguageGraph } from "./language-graph";

/**
 * Retrieve a Person graph describing the given author.
 *
 * @param {Partial<Author> & Pick<Author, "name">} author - The data.
 * @param {AvailableLocale} locale - The current locale.
 * @returns {Promise<Person>} A graph describing a Person.
 */
export const getPersonGraph = async (
  author: Partial<Author> & Pick<Author, "name">,
  locale: AvailableLocale
): Promise<Person> => {
  const websiteAuthor = `${WEBSITE_URL}#author` as const;

  return {
    "@type": "Person",
    ...(author.isWebsiteOwner === true && { "@id": websiteAuthor }),
    ...(author.lastName !== undefined && { familyName: author.lastName }),
    ...(author.firstName !== undefined && { givenName: author.firstName }),
    ...(author.avatar !== null &&
      author.avatar !== undefined && { image: await getImgSrc(author.avatar) }),
    ...(author.job !== undefined && { jobTitle: author.job }),
    ...(author.spokenLanguages !== undefined &&
      author.spokenLanguages.length > 0 && {
        knowsLanguage: author.spokenLanguages.map((language) =>
          getLanguageGraph(language, locale)
        ),
      }),
    name: author.name,
    ...(author.nationality && {
      nationality: getCountryGraph(author.nationality, locale),
    }),
    ...(author.website !== undefined && { url: author.website }),
  };
};
