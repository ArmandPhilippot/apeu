import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { queryCollection } from "../../../../lib/astro/collections/query-collection";
import { MissingSiteConfigError } from "../../../../utils/exceptions";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../../../utils/feeds";
import { useI18n } from "../../../../utils/i18n";

export const GET: APIRoute = async ({ currentLocale, site }) => {
  if (!site) throw new MissingSiteConfigError();
  const { locale, translate } = useI18n(currentLocale);
  const { entries } = await queryCollection("blogPosts", {
    format: "full",
    orderBy: { key: "publishedOn", order: "ASC" },
    where: { locale },
  });

  return rss({
    description: translate("feed.blog.posts.description"),
    items: await getRSSItemsFromEntries(entries, locale),
    site,
    title: translate("feed.blog.posts.title"),
    customData: `<language>${getFeedLanguageFromLocale(locale)}</language>`,
  });
};
