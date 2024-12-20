import rss from "@astrojs/rss";
import type { APIRoute, GetStaticPaths } from "astro";
import { queryCollection } from "../../../../../lib/astro/collections/query-collection";
import type { TaxonomyPreview } from "../../../../../types/data";
import { MissingSiteConfigError } from "../../../../../utils/exceptions";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../../../../utils/feeds";
import { useI18n } from "../../../../../utils/i18n";

export const getStaticPaths = (async () => {
  const { entries } = await queryCollection("blogCategories", {
    where: { locale: "en" },
  });

  return entries.map((cat) => {
    return {
      params: { slug: cat.slug },
      props: { ...cat },
    };
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute<TaxonomyPreview> = async ({
  currentLocale,
  props,
  site,
}) => {
  if (!site) throw new MissingSiteConfigError();
  const { locale, translate } = useI18n(currentLocale);
  const { entries } = await queryCollection("blogPosts", {
    format: "full",
    orderBy: { key: "publishedOn", order: "ASC" },
    where: { locale, categories: [props.id] },
  });

  return rss({
    description: translate("feed.blog.category.description", {
      name: props.title,
    }),
    items: await getRSSItemsFromEntries(entries, locale),
    site,
    title: translate("feed.blog.category.title", { name: props.title }),
    customData: `<language>${getFeedLanguageFromLocale(locale)}</language>`,
  });
};
