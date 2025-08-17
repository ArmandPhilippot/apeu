import type { AvailableLanguage } from "../../types/tokens";
import { queryCollection } from "../collections";
import { useI18n } from "../i18n";

type FeedLink = { label: string; slug: string };

/**
 * Retrieve the feeds data for each collection having a feed.
 *
 * @param {AvailableLanguage} language - The feed language.
 * @returns {Promise<FeedLink[]>} The label and slug for each feed.
 */
export const getCollectionsFeeds = async (
  language: AvailableLanguage
): Promise<FeedLink[]> => {
  const { locale, translate } = useI18n(language);
  const pagesWithFeed = [
    `${locale}/blog/categories`,
    `${locale}/blog/posts`,
    `${locale}/blogroll`,
    `${locale}/bookmarks`,
    `${locale}/guides`,
    `${locale}/notes`,
    `${locale}/projects`,
    `${locale}/tags`,
  ];
  const { entries: entriesWithStaticFeed } = await queryCollection(
    ["index.pages", "pages"],
    {
      format: "preview",
      orderBy: { key: "title", order: "ASC" },
      where: { ids: pagesWithFeed },
    }
  );
  const { entries: entriesWithDynamicFeed } = await queryCollection(
    ["blog.categories", "tags"],
    {
      format: "preview",
      orderBy: { key: "title", order: "ASC" },
      where: { locale },
    }
  );
  const entriesWithFeed = [...entriesWithStaticFeed, ...entriesWithDynamicFeed];

  return entriesWithFeed.map((entry) => {
    return {
      label: translate("feed.link.title", { title: entry.title }),
      slug: `${entry.route}/feed.xml`,
    };
  });
};
