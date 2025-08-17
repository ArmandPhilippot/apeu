import type { SearchAction, WebSite } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import { useRouting } from "../../../services/routing";
import type { AvailableLanguage } from "../../../types/tokens";
import { CONFIG } from "../../../utils/constants";
import { getWebsiteUrl } from "../../../utils/url";
import { getLanguageGraph } from "./language-graph";

export type CustomSearchAction = SearchAction & {
  // Required by Google
  "query-input": string;
};

type WebSiteGraphData = {
  description: string;
  locale: AvailableLanguage;
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
  const { routeById } = await useRouting();
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;
  const searchAction: CustomSearchAction = {
    "@type": "SearchAction",
    query: "required",
    "query-input": "required name=query",
    target: `${websiteUrl}${routeById(`${locale}/search`)}?${CONFIG.SEARCH.QUERY_PARAM}={query}`,
  };

  return {
    "@type": "WebSite",
    "@id": `${websiteUrl}${routeById(`${locale}/home`)}`,
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
    url: `${websiteUrl}${routeById(`${locale}/home`)}`,
  };
};
