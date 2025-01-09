import { getContainerRenderer as mdxRenderer } from "@astrojs/mdx";
import type { RSSFeedItem } from "@astrojs/rss";
import { experimental_AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import type { CollectionKey } from "astro:content";
import {
  DOCTYPE_NODE,
  ELEMENT_NODE,
  TEXT_NODE,
  transform,
  walk,
  type TextNode,
} from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { queryCollection } from "../lib/astro/collections";
import type { FeedCompatibleEntry } from "../types/data";
import { UnsupportedLocaleError } from "./exceptions";
import { isAvailableLanguage, useI18n, type AvailableLanguage } from "./i18n";
import { getWebsiteUrl } from "./url";

type CollectionWithFeed = Exclude<CollectionKey, "authors">;

const renderEntryContent = async (
  entry: FeedCompatibleEntry,
): Promise<string | undefined> => {
  if (!("Content" in entry)) return undefined;

  const websiteUrl = getWebsiteUrl();
  const renderers = await loadRenderers([mdxRenderer()]);
  const container = await experimental_AstroContainer.create({ renderers });
  const html = await container.renderToString(entry.Content);

  return transform(html, [
    async (ast) => {
      await walk(ast, (node) => {
        if (node.type === DOCTYPE_NODE) {
          (node as unknown as TextNode).type = TEXT_NODE;
          node.value = "";
        } else if (node.type === ELEMENT_NODE) {
          if (node.name === "a" && node.attributes["href"]?.startsWith("/")) {
            node.attributes["href"] = `${websiteUrl}${node.attributes["href"]}`;
          }
          if (node.name === "img" && node.attributes["src"]?.startsWith("/")) {
            node.attributes["src"] = `${websiteUrl}${node.attributes["src"]}`;
          }
        }
      });

      return ast;
    },
    sanitize({
      dropAttributes: {
        class: ["*"],
        "data-align-items": ["div"],
        "data-astro-source-file": ["*"],
        "data-astro-source-loc": ["*"],
        "data-centered": ["figure"],
        "data-clickable": ["img"],
        "data-diff": ["figure"],
        "data-gap": ["div"],
        "data-image-component": ["img"],
        "data-line-numbers": ["figure"],
        "data-path": ["figure"],
        "data-prompt": ["figure"],
        "data-size-min": ["div"],
        style: ["*"],
      },
      dropElements: ["link", "script", "style"],
    }),
  ]);
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
  const { entries: entriesWithDynamicFeed } = await queryCollection(
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
