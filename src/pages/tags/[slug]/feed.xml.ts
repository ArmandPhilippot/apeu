import rss from "@astrojs/rss";
import type { APIRoute, GetStaticPaths } from "astro";
import {
  queryCollection,
  queryCollections,
} from "../../../lib/astro/collections/query-collection";
import type { TaxonomyPreview } from "../../../types/data";
import { MissingSiteConfigError } from "../../../utils/exceptions";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../../utils/feeds";
import { useI18n } from "../../../utils/i18n";

export const getStaticPaths = (async () => {
  const { entries } = await queryCollection("tags", {
    where: { locale: "en" },
  });

  return entries.map((tag) => {
    return {
      params: { slug: tag.slug },
      props: { ...tag },
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
  const { entries } = await queryCollections(
    ["blogPosts", "blogroll", "bookmarks", "guides", "notes", "projects"],
    {
      format: "full",
      orderBy: { key: "publishedOn", order: "ASC" },
      where: { locale, tags: [props.id] },
    },
  );

  return rss({
    description: translate("feed.tag.description", { name: props.title }),
    items: await getRSSItemsFromEntries(entries, locale),
    site,
    title: translate("feed.tag.title", { name: props.title }),
    customData: `<language>${getFeedLanguageFromLocale(locale)}</language>`,
  });
};
