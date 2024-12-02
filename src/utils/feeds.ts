import type { RSSFeedItem } from "@astrojs/rss";
import { experimental_AstroContainer } from "astro/container";
import type { CollectionKey } from "astro:content";
import sanitizeHtml from "sanitize-html";
import type { FeedCompatibleEntry } from "../types/data";
import { UnsupportedLocaleError } from "./exceptions";
import { isAvailableLanguage, useI18n, type AvailableLanguage } from "./i18n";

type CollectionWithFeed = Exclude<CollectionKey, "authors">;

const renderEntryContent = async (
  entry: FeedCompatibleEntry,
): Promise<string | undefined> => {
  if (!("Content" in entry)) return undefined;

  const container = await experimental_AstroContainer.create();
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
  } as const satisfies Record<AvailableLanguage, string>;

  return availableLocales[locale];
};
