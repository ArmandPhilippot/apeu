import type { SearchAction, WebSite } from "schema-dts";
import { CONFIG } from "../../../utils/constants";
import { useI18n, type AvailableLanguage } from "../../../utils/i18n";
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
 * @returns {Website} The Website graph.
 */
export const getWebSiteGraph = ({
  description,
  locale,
  logo,
}: WebSiteGraphData): WebSite => {
  const { route, translate } = useI18n(locale);
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;
  const searchAction: CustomSearchAction = {
    "@type": "SearchAction",
    query: "required",
    "query-input": "required name=query",
    target: `${websiteUrl}${route("search")}?${CONFIG.SEARCH.QUERY_PARAM}={query}`,
  };

  return {
    "@type": "WebSite",
    "@id": `${websiteUrl}${route("home")}`,
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
    url: `${websiteUrl}${route("home")}`,
  };
};
