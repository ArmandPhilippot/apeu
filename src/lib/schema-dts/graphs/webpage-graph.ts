import type { WebPage } from "schema-dts";
import type { Crumb, Page } from "../../../types/data";
import { useI18n } from "../../../utils/i18n";
import { getImgSrc } from "../../../utils/images";
import { getWebsiteUrl } from "../../../utils/url";
import { getDurationFromReadingTime } from "../values/duration";
import { getBreadcrumbListGraph } from "./breadcrumb-list-graph";

type PageData = Pick<
  Page,
  "cover" | "description" | "locale" | "meta" | "route" | "title"
> & {
  breadcrumb?: Crumb[] | null | undefined;
  type?: WebPage["@type"] | null | undefined;
};

/**
 * Retrieve a WebPage graph from the given data.
 *
 * @param {PageData} data - The page data.
 * @returns {Promise<WebPage} The WebPage graph.
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
  const { route, translate } = useI18n(locale);
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;
  const url = `${websiteUrl}${pageRoute}`;

  return {
    "@id": url,
    "@type": type ?? "WebPage",
    author: { "@id": websiteAuthor },
    ...(breadcrumb && { breadcrumb: getBreadcrumbListGraph(breadcrumb) }),
    copyrightHolder: { "@id": websiteAuthor },
    dateCreated: meta.publishedOn.toISOString(),
    dateModified: meta.updatedOn.toISOString(),
    datePublished: meta.publishedOn.toISOString(),
    description,
    editor: { "@id": websiteAuthor },
    headline: title,
    isAccessibleForFree: true,
    isPartOf: { "@id": `${websiteUrl}${route("home")}` },
    lastReviewed: meta.updatedOn.toISOString(),
    license: translate("license.url"),
    name: title,
    publisher: { "@id": websiteAuthor },
    reviewedBy: { "@id": websiteAuthor },
    ...(meta.readingTime && {
      timeRequired: getDurationFromReadingTime(
        meta.readingTime.inMinutesAndSeconds,
      ),
    }),
    ...(cover && { thumbnailUrl: await getImgSrc(cover) }),
    url,
  };
};
