import type { Article, BlogPosting } from "schema-dts";
import { useI18n } from "../../../services/i18n";
import { useRouting } from "../../../services/routing";
import type { BlogPost, Guide, Img, Note, Project } from "../../../types/data";
import type { Blend, RequireOnly } from "../../../types/utilities";
import { WEBSITE_URL } from "../../../utils/constants";
import { getImgSrc } from "../../../utils/images";
import { isString } from "../../../utils/type-guards";
import { getDurationFromReadingTime } from "../values/duration";
import { getLanguageGraph } from "./language-graph";
import { getPersonGraph } from "./person-graph";

type ArticleCompatible = BlogPost | Guide | Note | Project;

type ArticleData = Pick<
  ArticleCompatible,
  "collection" | "description" | "locale" | "route" | "title"
> & {
  cover?: Img | null | undefined;
  meta: RequireOnly<
    Blend<ArticleCompatible["meta"]>,
    "publishedOn" | "updatedOn"
  >;
};

/**
 * Retrieve an Article (or a BlogPosting for blog posts) graph from the given
 * data.
 *
 * @param {ArticleData} data - An object containing the article data.
 * @returns {Promise<Article | BlogPosting>} The Article or BlogPosting graph.
 */
export const getArticleGraph = async ({
  collection,
  cover,
  description,
  locale,
  meta,
  route: articleRoute,
  title,
}: ArticleData): Promise<Article | BlogPosting> => {
  const { translate } = useI18n(locale);
  const { routeById } = await useRouting();
  const websiteAuthor = `${WEBSITE_URL}#author` as const;
  const url = `${WEBSITE_URL}${articleRoute}`;
  const coverUrl =
    cover === null || cover === undefined ? null : await getImgSrc(cover);
  const isBlogPost = collection === "blog.posts";
  const authors =
    "authors" in meta
      ? await Promise.all(
          meta.authors.map(async (author) => getPersonGraph(author, locale))
        )
      : null;

  return {
    "@type": isBlogPost ? "BlogPosting" : "Article",
    "@id": `${url}#article`,
    ...(authors !== null && {
      author: authors,
      copyrightHolder: authors,
    }),
    copyrightYear: meta.publishedOn.getFullYear(),
    dateCreated: meta.publishedOn.toISOString(),
    dateModified: meta.updatedOn.toISOString(),
    datePublished: meta.publishedOn.toISOString(),
    description,
    editor: { "@id": websiteAuthor },
    headline: title,
    ...(isString(coverUrl) && { image: coverUrl, thumbnailUrl: coverUrl }),
    inLanguage: getLanguageGraph(locale, locale),
    isAccessibleForFree: true,
    ...(isBlogPost && {
      isPartOf: { "@id": `${WEBSITE_URL}${routeById(`${locale}/blog`)}#blog` },
    }),
    ...(meta.tags !== null &&
      meta.tags !== undefined &&
      meta.tags.length > 0 && {
        keywords: meta.tags.map((tag) => tag.title).join(","),
      }),
    license: translate("license.url"),
    mainEntityOfPage: { "@id": url },
    name: title,
    publisher: { "@id": websiteAuthor },
    ...(meta.readingTime !== undefined && {
      timeRequired: getDurationFromReadingTime(
        meta.readingTime.inMinutesAndSeconds
      ),
      wordCount: meta.readingTime.wordsCount,
    }),
    url,
  };
};
