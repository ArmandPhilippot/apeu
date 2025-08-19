import type { CollectionKey } from "astro:content";
import { isValidCollection } from "../../lib/astro/collections/type-guards";
import type {
  NonRoutableCollectionKey,
  RoutableCollectionKey,
} from "../../lib/astro/collections/types";
import type { QueryMode } from "../../types/data";
import { CONFIG } from "../../utils/constants";
import {
  queryCollection,
  type QueriedCollectionEntry,
} from "./query-collection";
import type { QueriedEntry } from "./query-entry";

export type PageableCollection =
  | "blog.categories"
  | "index.pages"
  | "pages"
  | "tags";

export type PageableEntry = QueriedCollectionEntry<PageableCollection, "full">;

const COLLECTION_WITHOUT_LISTING = [
  "authors",
  "index.pages",
  "pages",
] as const satisfies CollectionKey[];

export type CollectionWithoutListing =
  (typeof COLLECTION_WITHOUT_LISTING)[number];

/**
 * Check if a collection does not support listing entries.
 *
 * @param {RoutableCollectionKey | NonRoutableCollectionKey} collection - A collection name to test.
 * @returns {boolean} True if the collection doesn't support listing.
 */
const isCollectionWithoutListing = (
  collection: RoutableCollectionKey | NonRoutableCollectionKey
): collection is CollectionWithoutListing =>
  (COLLECTION_WITHOUT_LISTING as readonly string[]).includes(collection);

export type ListingPageCollection = Exclude<
  CollectionKey,
  CollectionWithoutListing
>;

/**
 * Retrieve the collection name of entries to display on the index page.
 *
 * @param {QueriedEntry<CollectionKey>} page - The index page without Content component.
 * @returns {ListingPageCollection | ListingPageCollection[]} The collection names to display.
 * @throws If the page or the collection name is invalid.
 */
export const getDisplayedCollectionName = (
  page: QueriedEntry<CollectionKey>
): ListingPageCollection | ListingPageCollection[] => {
  if (
    !["index.pages", "pages"].includes(page.collection) ||
    !("locale" in page)
  ) {
    throw new Error(
      `Entry is not an index page, received collection: ${page.collection}`
    );
  }

  const collection = page.id
    .replace(`${page.locale}/`, "")
    .replaceAll("/", ".");

  if (collection === "home") {
    return ["blog.posts", "blogroll", "bookmarks", "guides", "projects"];
  }

  if (!isValidCollection(collection)) {
    throw new Error(`Collection not supported, received: ${collection}`);
  }

  if (isCollectionWithoutListing(collection)) {
    throw new Error(
      `Invalid collection, ${collection} does not support listing entries.`
    );
  }

  return collection;
};

export type RelatedEntries<
  T extends ListingPageCollection,
  F extends QueryMode = "full",
> = {
  collection: T | T[];
  entries: QueriedCollectionEntry<ListingPageCollection, F>[];
  total: number;
};

type FetcherOptions = {
  format?: QueryMode;
};

type Fetcher<T extends CollectionKey> = (
  page: PageableEntry,
  options?: FetcherOptions
) => Promise<{
  entries: QueriedCollectionEntry<T, QueryMode>[];
  total: number;
}>;

const fetchDisplayedCollectionEntries = async (
  page: PageableEntry,
  options: FetcherOptions = {}
): Promise<RelatedEntries<ListingPageCollection, QueryMode>> => {
  const { format = "full" } = options;
  const relatedCollection = getDisplayedCollectionName(page);
  const { entries, total } = await queryCollection(relatedCollection, {
    where: { locale: page.locale },
    format,
  });
  return { collection: relatedCollection, entries, total };
};

const fetchDisplayedTagEntries = async (
  { locale, id }: PageableEntry,
  options: FetcherOptions = {}
): Promise<RelatedEntries<ListingPageCollection, QueryMode>> => {
  const { format = "full" } = options;
  const withTags = [
    "blog.posts",
    "blogroll",
    "bookmarks",
    "guides",
    "notes",
    "projects",
  ] as const satisfies CollectionKey[];
  const { entries, total } = await queryCollection(
    ["blog.posts", "blogroll", "bookmarks", "guides", "notes", "projects"],
    {
      where: { locale, tags: [id] },
      format,
    }
  );
  return { collection: withTags, entries, total };
};

const fetchDisplayedBlogCategoryEntries = async (
  { locale, id }: PageableEntry,
  options: FetcherOptions = {}
): Promise<RelatedEntries<"blog.posts", QueryMode>> => {
  const { format = "full" } = options;
  const { entries, total } = await queryCollection("blog.posts", {
    where: { locale, categories: [id] },
    format,
  });
  return { collection: "blog.posts", entries, total };
};

const pageFetchers = {
  "blog.categories": fetchDisplayedBlogCategoryEntries,
  "index.pages": fetchDisplayedCollectionEntries,
  pages: fetchDisplayedCollectionEntries,
  tags: fetchDisplayedTagEntries,
} as const satisfies Record<PageableCollection, Fetcher<CollectionKey>>;

/**
 * Check if a page ID corresponds to a pageable collection listing page.
 *
 * @param {string} pageId - The page id to test.
 * @returns {boolean} True if the page id matches a pageable page.
 */
const isPageablePageId = (pageId: string): boolean => {
  const paginatedCollections: Set<string> = new Set<CollectionKey>([
    "blog.categories",
    "blog.posts",
    "blogroll",
    "bookmarks",
    "guides",
    "notes",
    "projects",
    "tags",
  ]);

  return CONFIG.LANGUAGES.AVAILABLE.some((locale) => {
    const collectionPath = pageId
      .replace(`${locale}/`, "")
      .replaceAll("/", ".");
    return paginatedCollections.has(collectionPath);
  });
};

/**
 * Determine if the given entry supports pagination.
 *
 * @param {QueriedCollectionEntry<CollectionKey, "full">} entry - The entry to test.
 * @returns {boolean} True if the entry supports pagination.
 */
export const isPageableEntry = (
  entry: QueriedCollectionEntry<CollectionKey, "full">
): entry is PageableEntry => {
  const alwaysPageableCollections = new Set<CollectionKey>([
    "blog.categories",
    "tags",
  ]);
  const idBasedPageableCollections = new Set<CollectionKey>([
    "index.pages",
    "pages",
  ]);

  if (idBasedPageableCollections.has(entry.collection)) {
    return isPageablePageId(entry.id);
  }

  return alwaysPageableCollections.has(entry.collection);
};

export type EnrichedPage<
  T extends ListingPageCollection = ListingPageCollection,
  F extends QueryMode = "full",
> = PageableEntry & {
  related: RelatedEntries<T, F>;
};

type AddRelatedItemsOptions<T extends QueryMode> = {
  format?: T;
};

/**
 * Enrich the given page object with related items.
 *
 * @template F - The expected entries format.
 * @param {PageableEntry} page - A page that can be paginated.
 * @param {AddRelatedItemsOptions<F>} options - Options for fetching related items.
 * @returns {Promise<EnrichedPage<ListingPageCollection, F>>} The page and its related items.
 */
export const addRelatedItemsToPage = async <F extends QueryMode = "full">(
  page: PageableEntry,
  options: AddRelatedItemsOptions<F> = {}
): Promise<EnrichedPage<ListingPageCollection, F>> => {
  const { format = "full" } = options;
  const fetcher = pageFetchers[page.collection];
  const { collection, entries, total } = await fetcher(page, { format });
  return {
    ...page,
    related: {
      collection,
      entries: entries as QueriedCollectionEntry<ListingPageCollection, F>[],
      total,
    },
  };
};

/**
 * Enrich the given pages object with related items.
 *
 * @template F - The expected entries format.
 * @param {PageableEntry[]} pages - The pages that can be paginated.
 * @param {AddRelatedItemsOptions<F>} options - Options for fetching related items.
 * @returns {Promise<EnrichedPage<ListingPageCollection, F>[]>} The pages and their related items.
 */
export const addRelatedItemsToPages = async <F extends QueryMode = "full">(
  pages: PageableEntry[],
  options: AddRelatedItemsOptions<F> = {}
): Promise<EnrichedPage<ListingPageCollection, F>[]> =>
  Promise.all(pages.map(async (page) => addRelatedItemsToPage(page, options)));
