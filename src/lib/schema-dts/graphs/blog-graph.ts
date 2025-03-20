import type { Blog } from "schema-dts";
import type { Page } from "../../../types/data";
import { useI18n } from "../../../utils/i18n";
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
  const { route, translate } = useI18n(locale);
  const websiteUrl = getWebsiteUrl();
  const websiteAuthor = `${websiteUrl}#author` as const;
  const blogUrl = `${websiteUrl}${route("blog")}`;

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
    isPartOf: { "@id": `${websiteUrl}${route("home")}` },
    license: translate("license.url"),
    mainEntityOfPage: blogUrl,
    name: title,
    publisher: { "@id": websiteAuthor },
    ...(cover !== null &&
      cover !== undefined && { thumbnailUrl: await getImgSrc(cover) }),
    url: blogUrl,
  };
};
