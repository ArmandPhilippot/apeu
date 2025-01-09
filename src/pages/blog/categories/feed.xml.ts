import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { queryCollection } from "../../../lib/astro/collections";
import { MissingSiteConfigError } from "../../../utils/exceptions";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../../utils/feeds";
import { useI18n } from "../../../utils/i18n";

export const GET: APIRoute = async ({ currentLocale, site, url }) => {
  if (!site) throw new MissingSiteConfigError();
  const { locale, translate } = useI18n(currentLocale);
  const { entries } = await queryCollection("blogCategories", {
    format: "full",
    orderBy: { key: "publishedOn", order: "ASC" },
    where: { locale },
  });

  return rss({
    description: translate("feed.blog.categories.description"),
    items: await getRSSItemsFromEntries(entries, locale),
    site,
    title: translate("feed.blog.categories.title"),
    customData: [
      `<language>${getFeedLanguageFromLocale(locale)}</language>`,
      `<atom:link href="${url}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
};
