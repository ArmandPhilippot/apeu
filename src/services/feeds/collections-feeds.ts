import type { Route } from "../../types/data";
import type { AvailableLocale } from "../../types/tokens";
import { queryCollection } from "../collections";
import { useI18n } from "../i18n";

/**
 * Retrieve the feeds data for each collection having a feed.
 *
 * @param {AvailableLocale} locale - The feed locale.
 * @returns {Promise<Route[]>} The label and the path for each feed.
 */
export const getCollectionsFeeds = async (
  locale: AvailableLocale
): Promise<Route[]> => {
  const { translate } = useI18n(locale);
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
      path: `${entry.route}/feed.xml`,
    };
  });
};
