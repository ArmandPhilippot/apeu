import rss from "@astrojs/rss";
import type { APIContext, APIRoute, GetStaticPaths } from "astro";
import { collections } from "../../content.config";
import {
  addRelatedItemsToPages,
  queryCollection,
  type EnrichedPage,
  type ListableCollectionKey,
  type RelatedEntries,
} from "../../services/collections";
import {
  getFeedLanguageFromLocale,
  getRSSItemsFromEntries,
} from "../../services/feeds";
import { useI18n } from "../../services/i18n";
import { CONFIG } from "../../utils/constants";
import { MissingSiteConfigError } from "../../utils/exceptions";

export const getStaticPaths = (async () => {
  const { entries } = await queryCollection(
    ["blog.categories", "index.pages", "pages", "tags"],
    { format: "full" }
  );
  const filteredEntries = entries.filter((entry) => {
    if (!["index.pages", "pages"].includes(entry.collection)) return true;
    return [...Object.keys(collections), "home"].includes(
      entry.id.replace(`${entry.locale}/`, "").replaceAll("/", ".")
    );
  });
  const enrichedEntries = await addRelatedItemsToPages(filteredEntries);
  return enrichedEntries.map((entry) => {
    const isHomepage = entry.id === `${entry.locale}/home`;
    const isDefaultLocale = CONFIG.LANGUAGES.DEFAULT === entry.locale;
    return {
      params: {
        page: isHomepage && isDefaultLocale ? undefined : entry.route.slice(1),
      },
      props: entry,
    };
  });
}) satisfies GetStaticPaths;

type GetTitleAndDescriptionConfig = {
  page: Pick<EnrichedPage, "id" | "locale" | "title">;
  relatedCollections: RelatedEntries<ListableCollectionKey>["collection"];
};

const getTitleAndDescription = ({
  page,
  relatedCollections,
}: GetTitleAndDescriptionConfig) => {
  const { translate } = useI18n(page.locale);
  const isHomepage = page.id === `${page.locale}/home`;

  if (isHomepage) {
    return {
      description: translate("feed.website.description"),
      title: translate("feed.website.title"),
    };
  }

  // Handle tag pages (mixed collections)
  if (Array.isArray(relatedCollections)) {
    return {
      description: translate("feed.tag.description", { name: page.title }),
      title: translate("feed.tag.title", { name: page.title }),
    };
  }

  // Handle blog.posts edge case (category vs blog index)
  if (relatedCollections === "blog.posts") {
    const isBlogIndex = page.id.endsWith("/blog");
    const feedType = isBlogIndex ? "blog.posts" : "blog.category";
    const interpolations = isBlogIndex ? {} : { name: page.title };

    return {
      description: translate(`feed.${feedType}.description`, interpolations),
      title: translate(`feed.${feedType}.title`, interpolations),
    };
  }

  return {
    description: translate(`feed.${relatedCollections}.description`),
    title: translate(`feed.${relatedCollections}.title`),
  };
};

/**
 * Handles the `GET` request to generate the `feed.xml` file at build time.
 *
 * @param {APIContext} context - The Astro API context.
 * @returns {Promise<Response>} The response containing the `feed.xml` file content.
 */
export const GET: APIRoute<EnrichedPage> = async ({
  props,
  site,
  url,
}: APIContext<EnrichedPage>): Promise<Response> => {
  if (site === undefined) throw new MissingSiteConfigError();
  const { related, ...page } = props;
  const { description, title } = getTitleAndDescription({
    page,
    relatedCollections: related.collection,
  });

  return rss({
    description,
    items: await getRSSItemsFromEntries(related.entries, page.locale),
    site,
    title,
    customData: [
      `<language>${getFeedLanguageFromLocale(page.locale)}</language>`,
      `<atom:link href="${url}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
  });
};
