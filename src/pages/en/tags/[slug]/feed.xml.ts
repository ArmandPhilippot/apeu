import rss from "@astrojs/rss";
import type { APIRoute, GetStaticPaths } from "astro";
import { queryCollection } from "../../../../lib/astro/collections";
import type { TaxonomyPreview } from "../../../../types/data";
import { MissingSiteConfigError } from "../../../../utils/exceptions";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../../../utils/feeds";
import { useI18n } from "../../../../utils/i18n";

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
  url,
}) => {
  if (!site) throw new MissingSiteConfigError();
  const { locale, translate } = useI18n(currentLocale);
  const { entries } = await queryCollection(
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
    customData: [
      `<language>${getFeedLanguageFromLocale(locale)}</language>`,
      `<atom:link href="${url}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
};
