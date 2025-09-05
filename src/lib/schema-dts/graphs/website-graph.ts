import type { SearchAction, WebSite } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import { useRouting } from "../../../services/routing";
import type { AvailableLocale } from "../../../types/tokens";
import { CONFIG, WEBSITE_URL } from "../../../utils/constants";
import { getLanguageGraph } from "./language-graph";

export type CustomSearchAction = SearchAction & {
  // Required by Google
  "query-input": string;
};

type WebSiteGraphData = {
  description: string;
  locale: AvailableLocale;
  logo: string;
};

/**
 * Retrieve a Website graph from the given data.
 *
 * @param {WebSiteGraphData} data - The website data.
 * @returns {Promise<WebSite>} The Website graph.
 */
export const getWebSiteGraph = async ({
  description,
  locale,
  logo,
}: WebSiteGraphData): Promise<WebSite> => {
  const { translate } = useI18n(locale);
  const { routeById } = await useRouting(locale);
  const websiteAuthor = `${WEBSITE_URL}#author` as const;
  const searchAction: CustomSearchAction = {
    "@type": "SearchAction",
    query: "required",
    "query-input": "required name=query",
    target: `${WEBSITE_URL}${routeById("search").path}?${CONFIG.SEARCH.QUERY_PARAM}={query}`,
  };

  return {
    "@type": "WebSite",
    "@id": `${WEBSITE_URL}${routeById("home").path}`,
    author: { "@id": websiteAuthor },
    copyrightHolder: { "@id": websiteAuthor },
    copyrightYear: CONFIG.CREATION_YEAR,
    creator: { "@id": websiteAuthor },
    description,
    editor: { "@id": websiteAuthor },
    image: logo,
    inLanguage: getLanguageGraph(locale, locale),
    isAccessibleForFree: true,
    license: translate("license.url"),
    name: CONFIG.BRAND,
    potentialAction: searchAction,
    publisher: { "@id": websiteAuthor },
    thumbnailUrl: logo,
    url: `${WEBSITE_URL}${routeById("home").path}`,
  };
};
