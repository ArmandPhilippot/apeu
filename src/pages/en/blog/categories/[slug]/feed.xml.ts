import rss from "@astrojs/rss";
import type { APIContext, APIRoute, GetStaticPaths } from "astro";
import { queryCollection } from "../../../../../lib/astro/collections";
import type { TaxonomyPreview } from "../../../../../types/data";
import { MissingSiteConfigError } from "../../../../../utils/exceptions";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../../../../utils/feeds";
import { useI18n } from "../../../../../utils/i18n";

export const getStaticPaths = (async () => {
  const { entries } = await queryCollection("blog.categories", {
    where: { locale: "en" },
  });

  return entries.map((cat) => {
    return {
      params: { slug: cat.slug },
      props: { ...cat },
    };
  });
}) satisfies GetStaticPaths;

/**
 * Handles the `GET` request to generate the `feed.xml` file at build time.
 *
 * @param {APIContext<TaxonomyPreview>} context - The Astro API context.
 * @returns {Promise<Response>} The response containing the `feed.xml` file content.
 */
export const GET: APIRoute<TaxonomyPreview> = async ({
  currentLocale,
  props,
  site,
  url,
}: APIContext<TaxonomyPreview>): Promise<Response> => {
  if (site === undefined) throw new MissingSiteConfigError();

  const { locale, translate } = useI18n(currentLocale);
  const { entries } = await queryCollection("blog.posts", {
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
    customData: [
      `<language>${getFeedLanguageFromLocale(locale)}</language>`,
      `<atom:link href="${url}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
};
