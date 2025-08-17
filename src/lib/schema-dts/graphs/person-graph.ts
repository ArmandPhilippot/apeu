import type { Person } from "schema-dts";
import type { Author } from "../../../types/data";
import type { AvailableLanguage } from "../../../types/tokens";
import { getImgSrc } from "../../../utils/images";
import { getWebsiteUrl } from "../../../utils/url";
import { getCountryGraph } from "./country-graph";
import { getLanguageGraph } from "./language-graph";

/**
 * Retrieve a Person graph describing the given author.
 *
 * @param {Partial<Author> & Pick<Author, "name">} author - The data.
 * @param {AvailableLanguage} locale - The current locale.
 * @returns {Promise<Person>} A graph describing a Person.
 */
export const getPersonGraph = async (
  author: Partial<Author> & Pick<Author, "name">,
  locale: AvailableLanguage
): Promise<Person> => {
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;

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
