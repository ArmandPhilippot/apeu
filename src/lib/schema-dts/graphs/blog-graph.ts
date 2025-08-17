import type { Blog } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import { useRouting } from "../../../services/routing";
import type { Page } from "../../../types/data";
import { getImgSrc } from "../../../utils/images";
import { getWebsiteUrl } from "../../../utils/url";

type BlogData = Pick<
  Page,
  "cover" | "description" | "locale" | "meta" | "title"
>;

/**
 * Retrieve a Blog graph from the given data.
 *
 * @param {BlogData} data - An object containing the blog data.
 * @returns {Promise<Blog>} A graph representing the Blog.
 */
export const getBlogGraph = async ({
  cover,
  description,
  locale,
  meta,
  title,
}: BlogData): Promise<Blog> => {
  const { translate } = useI18n(locale);
  const { routeById } = await useRouting();
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;
  const blogUrl = `${websiteUrl}${routeById(`${locale}/blog`)}`;

  return {
    "@id": `${blogUrl}#blog`,
    "@type": "Blog",
    author: { "@id": websiteAuthor },
    copyrightHolder: { "@id": websiteAuthor },
    dateCreated: meta.publishedOn.toISOString(),
    dateModified: meta.updatedOn.toISOString(),
    datePublished: meta.publishedOn.toISOString(),
    description,
    editor: { "@id": websiteAuthor },
    headline: title,
    isAccessibleForFree: true,
    isPartOf: { "@id": `${websiteUrl}${routeById(`${locale}/home`)}` },
    license: translate("license.url"),
    mainEntityOfPage: blogUrl,
    name: title,
    publisher: { "@id": websiteAuthor },
    ...(cover !== null &&
      cover !== undefined && { thumbnailUrl: await getImgSrc(cover) }),
    url: blogUrl,
  };
};
