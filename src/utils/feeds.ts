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
  type Node as AstNode,
  type ElementNode,
  type TextNode,
} from "ultrahtml";
import sanitize, {
  type SanitizeOptions,
} from "ultrahtml/transformers/sanitize";
import { queryCollection } from "../lib/astro/collections";
import type { FeedCompatibleEntry } from "../types/data";
import { UnsupportedLocaleError } from "./exceptions";
import { isAvailableLanguage, useI18n, type AvailableLanguage } from "./i18n";
import { getWebsiteUrl } from "./url";

type CollectionWithFeed = Exclude<CollectionKey, "authors">;

const SANITIZE_CONFIG = {
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
} as const satisfies SanitizeOptions;

const isJsOnlyNode = (node: AstNode): boolean =>
  !!node.attributes?.class?.includes("js-only");

const clearNode = (node: AstNode): void => {
  (node as unknown as TextNode).type = TEXT_NODE;
  node.value = "";
};

const createUrlTransformer = () => {
  const websiteUrl = getWebsiteUrl();

  return (path: string): string =>
    path.startsWith("/") || path.startsWith("#")
      ? `${websiteUrl}${path}`
      : path;
};

const transformCalloutToDiv = (node: ElementNode): void => {
  node.name = "div";
  node.role = "note";
  if (node.attributes?.label) {
    node.attributes["aria-label"] = node.attributes.label;
    delete node.attributes.label;
  }
  if (node.attributes?.type) {
    delete node.attributes.type;
  }
};

/*
 * Special thanks for the inspiration:
 * @Princesseuh https://github.com/Princesseuh/erika.florist/blob/ed50468bece9f8cd4156c1b1d0e628b989a01e96/src/middleware.ts
 * @delucis https://github.com/delucis/astro-blog-full-text-rss/blob/17c14db9b4fd68a20f097f5ad8ae66edb2da1815/src/pages/rss.xml.ts
 * @HiDeoo https://github.com/HiDeoo/starlight-blog/blob/fb46bad1ac7c6c8e8ac6802fcd2891804326666c/packages/starlight-blog/libs/rss.ts#L123-L161
 */
const createNodeTransformer = () => {
  const makeAbsoluteUrl = createUrlTransformer();

  return async (node: AstNode): Promise<void> => {
    if (node.type === DOCTYPE_NODE || isJsOnlyNode(node)) {
      clearNode(node);
      return;
    }

    if (node.type !== ELEMENT_NODE) return;

    if (node.name === "a" && node.attributes?.href) {
      node.attributes.href = makeAbsoluteUrl(node.attributes.href);
    } else if (node.name === "img" && node.attributes?.src) {
      node.attributes.src = makeAbsoluteUrl(node.attributes.src);
    } else if (node.name === "callout") {
      transformCalloutToDiv(node);
    }
  };
};

const transformContent = async (html: string): Promise<string> => {
  return transform(html, [
    async (ast) => {
      await walk(ast, createNodeTransformer());
      return ast;
    },
    sanitize(SANITIZE_CONFIG),
  ]);
};

const renderEntryContent = async (
  entry: FeedCompatibleEntry,
): Promise<string | undefined> => {
  if (!("Content" in entry)) return undefined;

  const renderers = await loadRenderers([mdxRenderer()]);
  const container = await experimental_AstroContainer.create({ renderers });
  const html = await container.renderToString(entry.Content);

  return transformContent(html);
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

const getItemCategories = (entry: FeedCompatibleEntry) => {
  const categories: string[] = [];

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
    const content = await renderEntryContent(entry);

    return {
      categories: getItemCategories(entry),
      ...(content ? { content } : {}),
      description: getItemDescription(entry, locale),
      link: "route" in entry ? entry.route : entry.url,
      pubDate: entry.meta.publishedOn,
      title: `[${getItemCategoryFromCollection(entry.collection, locale)}] ${entry.title}`,
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
