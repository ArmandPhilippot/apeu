import type { WebPage } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import { useRouting } from "../../../services/routing";
import type { Route, Page } from "../../../types/data";
import { WEBSITE_URL } from "../../../utils/constants";
import { getImgSrc } from "../../../utils/images";
import { getDurationFromReadingTime } from "../values/duration";
import { getBreadcrumbListGraph } from "./breadcrumb-list-graph";

type PageData = Pick<
  Page,
  "cover" | "description" | "locale" | "meta" | "route" | "title"
> & {
  breadcrumb?: Route[] | null | undefined;
  type?: WebPage["@type"] | null | undefined;
};

/**
 * Retrieve a WebPage graph from the given data.
 *
 * @param {PageData} data - An object containing the page data.
 * @returns {Promise<WebPage>} A graph representing the WebPage.
 */
export const getWebPageGraph = async ({
  breadcrumb,
  cover,
  description,
  locale,
  meta,
  route: pageRoute,
  title,
  type,
}: PageData): Promise<WebPage> => {
  const { translate } = useI18n(locale);
  const { routeById } = await useRouting(locale);
  const websiteAuthor = `${WEBSITE_URL}#author` as const;
  const url = `${WEBSITE_URL}${pageRoute}`;

  return {
    "@id": url,
    "@type": type ?? "WebPage",
    author: { "@id": websiteAuthor },
    ...(breadcrumb !== null &&
      breadcrumb !== undefined && {
        breadcrumb: getBreadcrumbListGraph(breadcrumb),
      }),
    copyrightHolder: { "@id": websiteAuthor },
    dateCreated: meta.publishedOn.toISOString(),
    dateModified: meta.updatedOn.toISOString(),
    datePublished: meta.publishedOn.toISOString(),
    description,
    editor: { "@id": websiteAuthor },
    headline: title,
    isAccessibleForFree: true,
    isPartOf: { "@id": `${WEBSITE_URL}${routeById("home").path}` },
    lastReviewed: meta.updatedOn.toISOString(),
    license: translate("license.url"),
    name: title,
    publisher: { "@id": websiteAuthor },
    reviewedBy: { "@id": websiteAuthor },
    ...(meta.readingTime !== undefined && {
      timeRequired: getDurationFromReadingTime(
        meta.readingTime.inMinutesAndSeconds
      ),
    }),
    ...(cover !== null &&
      cover !== undefined && { thumbnailUrl: await getImgSrc(cover) }),
    url,
  };
};
