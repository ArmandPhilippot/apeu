import type { CollectionKey } from "astro:content";
import type { QueryMode } from "../../types/data";
import type { AvailableLocale } from "../../types/tokens";
import { CONFIG } from "../../utils/constants";
import {
  queryCollection,
  type QueriedCollectionEntry,
} from "./query-collection";

const PAGEABLE_COLLECTION_KEYS = [
  "blog.categories",
  "blog.posts",
  "blogroll",
  "bookmarks",
  "guides",
  "notes",
  "projects",
] as const satisfies CollectionKey[];

const LISTABLE_COLLECTION_KEYS = [
  ...PAGEABLE_COLLECTION_KEYS,
  "tags",
] as const satisfies CollectionKey[];

export type ListableCollectionKey = (typeof LISTABLE_COLLECTION_KEYS)[number];

export type CollectionSupportingRelatedEntries =
  | "blog.categories"
  | "index.pages"
  | "pages"
  | "tags";

export type PageWithRelatedEntries<
  T extends CollectionSupportingRelatedEntries =
    CollectionSupportingRelatedEntries,
> = QueriedCollectionEntry<T, "full">;

export type PageableCollection = Exclude<
  CollectionSupportingRelatedEntries,
  "tags"
>;

export type NonPageableCollection = Exclude<
  CollectionSupportingRelatedEntries,
  PageableCollection
>;

export type PageableEntry = QueriedCollectionEntry<PageableCollection, "full">;

/**
 * Retrieves the key of a collection to display on the page based on its id.
 *
 * Be aware this function doesn't check if the page id is valid. The returned
 * string could be an invalid collection key.
 *
 * @param {string} id - A page id.
 * @param {AvailableLocale} locale - The current locale.
 * @returns {string} Maybe a valid collection key.
 */
const getListableCollectionKey = (
  id: string,
  locale: AvailableLocale
): string => id.replace(`${locale}/`, "").replaceAll("/", ".");

/**
 * Checks if a page ID corresponds to a listing page.
 *
 * @param {string} pageId - The page id to test.
 * @returns {boolean} True if the page id matches a listing page.
 */
const isListingPageId = (pageId: string): boolean =>
  CONFIG.LANGUAGES.AVAILABLE.some((locale) => {
    const collectionKey = getListableCollectionKey(pageId, locale);
    return (LISTABLE_COLLECTION_KEYS as string[]).includes(collectionKey);
  });

/**
 * Checks if the given entry lists related items.
 *
 * @param {QueriedCollectionEntry<CollectionKey, "full">} entry - The entry to test.
 * @returns {boolean} True if the entry lists related items.
 */
export const isListingRelatedEntries = (
  entry: QueriedCollectionEntry<CollectionKey, "full">
): entry is PageWithRelatedEntries => {
  const idBasedListingPage = new Set<CollectionKey>(["index.pages", "pages"]);

  if (idBasedListingPage.has(entry.collection)) {
    return isListingPageId(entry.id);
  }

  const alwaysListingPage = new Set<CollectionKey>(["blog.categories", "tags"]);

  return alwaysListingPage.has(entry.collection);
};

/**
 * Checks if the given page should be paginated.
 *
 * @param {PageWithRelatedEntries} page - The page to test.
 * @returns {boolean} True if the page is pageable.
 */
export const shouldPaginateListing = (
  page: PageWithRelatedEntries
): page is PageableEntry => {
  const collectionKey = getListableCollectionKey(page.id, page.locale);
  return (PAGEABLE_COLLECTION_KEYS as string[]).includes(collectionKey);
};

const isValidRelatedCollectionKey = (
  collection: string
): collection is ListableCollectionKey =>
  (LISTABLE_COLLECTION_KEYS as string[]).includes(collection);

/**
 * Retrieve the collection name of entries to display on the index page.
 *
 * @param {Pick<PageWithRelatedEntries<"index.pages" | "pages">, "id" | "locale">} page - The index page id and locale.
 * @returns {ListableCollectionKey | ListableCollectionKey[]} The collection names to display.
 * @throws If the page or the collection name is invalid.
 */
export const getPageRelatedCollectionKeys = ({
  id,
  locale,
}: Pick<PageWithRelatedEntries<"index.pages" | "pages">, "id" | "locale">):
  | ListableCollectionKey
  | ListableCollectionKey[] => {
  const collection = getListableCollectionKey(id, locale);

  if (collection === "authors") {
    throw new Error(
      `Invalid collection, ${collection} does not support listing entries.`
    );
  }

  if (collection === "home") {
    return ["blog.posts", "blogroll", "bookmarks", "guides", "projects"];
  }

  if (!isValidRelatedCollectionKey(collection)) {
    throw new Error(
      `The id doesn't match a valid listing page. Received: ${id}`
    );
  }

  return collection;
};

type FetcherOptions = {
  format?: QueryMode;
};

type Fetcher<T extends CollectionKey> = (
  page: PageWithRelatedEntries,
  options?: FetcherOptions
) => Promise<{
  entries: QueriedCollectionEntry<T, QueryMode>[];
  total: number;
}>;

const fetchBlogCategoryRelatedEntries = async (
  { collection, locale, id }: PageWithRelatedEntries,
  options: FetcherOptions = {}
): Promise<RelatedEntries<"blog.posts", QueryMode>> => {
  if (collection !== "blog.categories") {
    throw new Error(
      `Can only fetch related entries for a blog category, received: ${collection}.`
    );
  }

  const { format = "full" } = options;
  const { entries, total } = await queryCollection("blog.posts", {
    format,
    orderBy: { key: "publishedOn", order: "DESC" },
    where: { locale, categories: [id] },
  });
  return { collection: "blog.posts", entries, total };
};

const fetchListingPageRelatedEntries = async (
  page: PageWithRelatedEntries,
  options: FetcherOptions = {}
): Promise<RelatedEntries<ListableCollectionKey, QueryMode>> => {
  if (!["index.pages", "pages"].includes(page.collection)) {
    throw new Error(
      `Can only fetch related entries for a page or index page, received: ${page.collection}.`
    );
  }

  const { format = "full" } = options;
  const relatedCollections = getPageRelatedCollectionKeys(page);
  const isTaxonomiesListing =
    typeof relatedCollections === "string" &&
    (relatedCollections === "blog.categories" || relatedCollections === "tags");
  const isBlogrollListing =
    typeof relatedCollections === "string" && relatedCollections === "blogroll";
  const { entries, total } = await queryCollection(relatedCollections, {
    format,
    orderBy:
      isTaxonomiesListing || isBlogrollListing
        ? { key: "title", order: "ASC" }
        : { key: "publishedOn", order: "DESC" },
    where: { locale: page.locale },
  });
  return { collection: relatedCollections, entries, total };
};

const fetchTagRelatedEntries = async (
  { collection, locale, id }: PageWithRelatedEntries,
  options: FetcherOptions = {}
): Promise<RelatedEntries<ListableCollectionKey, QueryMode>> => {
  if (collection !== "tags") {
    throw new Error(
      `Can only fetch related entries for a tag entry, received: ${collection}.`
    );
  }

  const { format = "full" } = options;
  const withTags = [
    "blog.posts",
    "blogroll",
    "bookmarks",
    "guides",
    "notes",
    "projects",
  ] as const satisfies CollectionKey[];
  const { entries, total } = await queryCollection(withTags, {
    format,
    orderBy: { key: "publishedOn", order: "DESC" },
    where: { locale, tags: [id] },
  });
  return { collection: withTags, entries, total };
};

const pageFetchers = {
  "blog.categories": fetchBlogCategoryRelatedEntries,
  "index.pages": fetchListingPageRelatedEntries,
  pages: fetchListingPageRelatedEntries,
  tags: fetchTagRelatedEntries,
} as const satisfies Record<
  CollectionSupportingRelatedEntries,
  Fetcher<CollectionKey>
>;

export type RelatedEntries<
  T extends ListableCollectionKey,
  F extends QueryMode = "full",
> = {
  collection: T | T[];
  entries: QueriedCollectionEntry<ListableCollectionKey, F>[];
  total: number;
};

export type PaginatedEnrichedPage<
  T extends ListableCollectionKey = ListableCollectionKey,
  F extends QueryMode = "full",
> = PageableEntry & {
  related: RelatedEntries<T, F>;
};

export type NonPaginatedEnrichedPage<
  T extends ListableCollectionKey = ListableCollectionKey,
  F extends QueryMode = "full",
> = PageWithRelatedEntries<NonPageableCollection> & {
  related: RelatedEntries<T, F>;
};

export type EnrichedPage<
  T extends ListableCollectionKey = ListableCollectionKey,
  F extends QueryMode = "full",
> = PaginatedEnrichedPage<T, F> | NonPaginatedEnrichedPage<T, F>;

type AddRelatedItemsOptions<T extends QueryMode> = {
  format?: T;
};

/**
 * Enrich the given page object with related items.
 *
 * @template F - The expected entries format.
 * @param {PageWithRelatedEntries} page - A listing page.
 * @param {AddRelatedItemsOptions<F>} options - Options for fetching related items.
 * @returns {Promise<EnrichedPage<ListableCollectionKey, F>>} The page and its related items.
 */
export const addRelatedItemsToPage = async <F extends QueryMode = "full">(
  page: PageWithRelatedEntries,
  options: AddRelatedItemsOptions<F> = {}
): Promise<EnrichedPage<ListableCollectionKey, F>> => {
  const { format = "full" } = options;
  const fetcher = pageFetchers[page.collection];
  const { collection, entries, total } = await fetcher(page, { format });
  return {
    ...page,
    related: {
      collection,
      entries: entries as QueriedCollectionEntry<ListableCollectionKey, F>[],
      total,
    },
  };
};

/**
 * Enrich the given pages object with related items.
 *
 * @template F - The expected entries format.
 * @param {PageWithRelatedEntries[]} pages - The listing pages.
 * @param {AddRelatedItemsOptions<F>} options - Options for fetching related items.
 * @returns {Promise<EnrichedPage<ListableCollectionKey, F>[]>} The pages and their related items.
 */
export function addRelatedItemsToPages<F extends QueryMode = "full">(
  pages: PageableEntry[],
  options?: AddRelatedItemsOptions<F>
): Promise<PaginatedEnrichedPage<ListableCollectionKey, F>[]>;
export function addRelatedItemsToPages<F extends QueryMode = "full">(
  pages: PageWithRelatedEntries<"tags">[],
  options?: AddRelatedItemsOptions<F>
): Promise<NonPaginatedEnrichedPage<ListableCollectionKey, F>[]>;
export function addRelatedItemsToPages<F extends QueryMode = "full">(
  pages: PageWithRelatedEntries[],
  options?: AddRelatedItemsOptions<F>
): Promise<EnrichedPage<ListableCollectionKey, F>[]>;
export async function addRelatedItemsToPages<F extends QueryMode = "full">(
  pages: PageWithRelatedEntries[],
  options: AddRelatedItemsOptions<F> = {}
): Promise<EnrichedPage<ListableCollectionKey, F>[]> {
  return Promise.all(
    pages.map(async (page) => addRelatedItemsToPage(page, options))
  );
}
