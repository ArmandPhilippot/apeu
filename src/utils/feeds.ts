import { getContainerRenderer as mdxRenderer } from "@astrojs/mdx";
import type { RSSFeedItem } from "@astrojs/rss";
import { experimental_AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import type { CollectionKey } from "astro:content";
import sanitizeHtml from "sanitize-html";
import {
  queryCollection,
  queryCollections,
} from "../lib/astro/collections/query-collection";
import type { FeedCompatibleEntry } from "../types/data";
import { UnsupportedLocaleError } from "./exceptions";
import { isAvailableLanguage, useI18n, type AvailableLanguage } from "./i18n";

type CollectionWithFeed = Exclude<CollectionKey, "authors">;

const renderEntryContent = async (
  entry: FeedCompatibleEntry,
): Promise<string | undefined> => {
  if (!("Content" in entry)) return undefined;

  const renderers = await loadRenderers([mdxRenderer()]);
  const container = await experimental_AstroContainer.create({ renderers });
  const htmlContent = await container.renderToString(entry.Content);

  return sanitizeHtml(htmlContent, {
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "hreflang"],
    },
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  });
};

const getItemCategoryFromCollection = (
  collection: CollectionWithFeed,
  locale: AvailableLanguage,
) => {
  const { translate } = useI18n(locale);
  const categories = {
    blogCategories: translate("meta.value.content.kind.blog.category"),
    blogPosts: translate("meta.value.content.kind.blog.post"),
    blogroll: translate("meta.value.content.kind.blogroll"),
    bookmarks: translate("meta.value.content.kind.bookmark"),
    guides: translate("meta.value.content.kind.guide"),
    notes: translate("meta.value.content.kind.note"),
    pages: translate("meta.value.content.kind.page"),
    projects: translate("meta.value.content.kind.project"),
    tags: translate("meta.value.content.kind.tag"),
  } as const satisfies Record<CollectionWithFeed, string>;

  return categories[collection];
};

const getItemCategories = (
  entry: FeedCompatibleEntry,
  locale: AvailableLanguage,
) => {
  const categories = [getItemCategoryFromCollection(entry.collection, locale)];

  if ("tags" in entry.meta && entry.meta.tags?.length) {
    categories.push(...entry.meta.tags.map((tag) => tag.title));
  }

  return categories;
};

const getItemDescription = (
  entry: FeedCompatibleEntry,
  locale: AvailableLanguage,
) => {
  if (entry.collection === "blogroll") return entry.description[locale];

  return entry.description;
};

const getRSSItem =
  (locale: AvailableLanguage) =>
  async (entry: FeedCompatibleEntry): Promise<RSSFeedItem> => {
    return {
      categories: getItemCategories(entry, locale),
      content: await renderEntryContent(entry),
      description: getItemDescription(entry, locale),
      link: "route" in entry ? entry.route : entry.url,
      pubDate: entry.meta.publishedOn,
      title: entry.title,
    };
  };

/**
 * Convert the given entries to valid RSS items.
 *
 * @param {FeedCompatibleEntry[]} entries - The collections entries.
 * @param {AvailableLanguage} locale - The feed locale.
 * @returns {Promise<RSSFeedItem[]>} The feed items.
 */
export const getRSSItemsFromEntries = async (
  entries: FeedCompatibleEntry[],
  locale: AvailableLanguage,
): Promise<RSSFeedItem[]> => {
  const rssItems: (RSSFeedItem | null)[] = await Promise.all(
    entries.map(getRSSItem(locale)),
  );

  return rssItems.filter((item) => item !== null);
};

/**
 * Retrieve the language to display between `<language>` tag in your feed.
 *
 * @param {AvailableLanguage} locale - The current locale.
 * @returns {string} The language.
 */
export const getFeedLanguageFromLocale = (locale: string): string => {
  if (!isAvailableLanguage(locale)) throw new UnsupportedLocaleError(locale);

  const availableLocales = {
    en: "en-us",
    fr: "fr-fr",
  } as const satisfies Record<AvailableLanguage, string>;

  return availableLocales[locale];
};

export const getCollectionsFeeds = async (language: AvailableLanguage) => {
  const { locale, translate } = useI18n(language);
  const pagesWithFeed = [
    `${locale}/blog/categories`,
    `${locale}/blog/posts`,
    `${locale}/blogroll`,
    `${locale}/bookmarks`,
    `${locale}/contributions`,
    `${locale}/guides`,
    `${locale}/notes`,
    `${locale}/projects`,
    `${locale}/tags`,
  ];
  const { entries: entriesWithStaticFeed } = await queryCollection("pages", {
    format: "preview",
    orderBy: { key: "title", order: "ASC" },
    where: { ids: pagesWithFeed },
  });
  const { entries: entriesWithDynamicFeed } = await queryCollections(
    ["blogCategories", "tags"],
    {
      format: "preview",
      orderBy: { key: "title", order: "ASC" },
      where: { locale },
    },
  );
  const entriesWithFeed = [...entriesWithStaticFeed, ...entriesWithDynamicFeed];

  return entriesWithFeed.map((entry) => {
    return {
      label: translate("feed.link.title", { title: entry.title }),
      slug: `${entry.route}/feed.xml`,
    };
  });
};
