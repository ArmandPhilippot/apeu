import type { LocalImageProps, RemoteImageProps } from "astro:assets";
import type {
  CollectionEntry,
  CollectionKey,
  RenderResult,
} from "astro:content";
import type { RoutableCollectionKey } from "../lib/astro/collections/types";
import type { AvailableLocale, IconName } from "./tokens";
import type { ConditionallyExtend, PatchExistingProperties } from "./utilities";

export type Route = {
  /** The label of the route. */
  label: string;
  /** The pathname of the route. */
  path: string;
};

export type Icon = { name: IconName; size?: number };

export type WithIcon<T> = T & {
  icon?: Icon | null | undefined;
};

type MetaValue = string | Date | Route;

export type MetaItem = {
  label: string;
  values: MetaValue[];
  icon?: { name: IconName; size?: number | string } | undefined | null;
  description?: string;
};

export type EntryPreviewCTA = WithIcon<Route> & {
  ariaLabel?: string | null | undefined;
  isExternal?: boolean | null | undefined;
};

export type EntryPreview = {
  cover?: Img | null | undefined;
  cta?: EntryPreviewCTA[] | null | undefined;
  description: string;
  featuredMeta?: MetaItem | null | undefined;
  heading: string | Route;
  isQuote?: boolean | null | undefined;
  locale?: string | null | undefined;
  meta?: MetaItem[] | null | undefined;
};

export type AltLanguage = {
  locale: AvailableLocale;
  route: string;
};

export type HeadingNode = {
  children?: HeadingNode[] | null | undefined;
  label: string;
  slug: string;
};

export type Img = Omit<
  LocalImageProps | RemoteImageProps,
  "alt" | "width" | "height"
> & {
  alt?: string | null | undefined;
  height?: number | undefined;
  width?: number | undefined;
};

type RenderedContent = RenderResult & {
  hasContent: boolean;
};

export type ReadingTime = {
  /**
   * The reading time rounded to minutes only.
   */
  inMinutes: number;
  /**
   * The reading time in minutes and seconds.
   */
  inMinutesAndSeconds: {
    minutes: number;
    seconds: number;
  };
  /**
   * The number of words.
   */
  wordsCount: number;
  /**
   * The number of words read per minute.
   */
  wordsPerMinute: number;
};

export type RemarkPluginFrontmatterMeta = {
  readingTime?: ReadingTime | undefined;
};

export type SEO = {
  author?: Omit<AuthorLink, "isWebsiteOwner"> | null | undefined;
  canonical?: string | null | undefined;
  description?: string;
  languages?: AltLanguage[] | null | undefined;
  nofollow?: boolean | null | undefined;
  noindex?: boolean | null | undefined;
  title: string;
};

type ComputedFields = {
  locale: string;
  route: string;
  slug: string;
};

/**
 * Add ComputedFields to a type only if the collection key is routable.
 *
 * @template T - The base type to potentially extend with computed fields.
 * @template K - The collection key to check for routability.
 *
 * @example
 * ```typescript
 * // Usage in your FormattedEntry type
 * export type FormattedEntry<
 *   T extends CollectionKey,
 *   Mode extends QueryMode = "preview",
 * > = AddComputedFieldsIfRoutable<
 *   Pick<CollectionEntry<T>, "collection" | "id"> & {
 *     data: PatchMeta<CollectionEntry<T>["data"]>;
 *   },
 *   T
 * > & (Mode extends "full"
 *   ? Omit<RenderedContent, "remarkPluginFrontmatter">
 *   : unknown);
 * ```
 */
type AddComputedFieldsIfRoutable<T, K> = ConditionallyExtend<
  T,
  K,
  RoutableCollectionKey,
  ComputedFields
>;

export type QueryMode = "full" | "preview";

/**
 * Determine valid query modes based on collection routability. Only routable
 * collections can use query modes; non-routable collections return never.
 *
 * @template K - The collection key to check for routability.
 *
 * @example
 * ```typescript
 * type BlogModes = ValidQueryMode<"blog">; // "preview" | "full"
 * type AuthorModes = ValidQueryMode<"authors">; // never
 * ```
 */
type ValidQueryMode<K> = K extends RoutableCollectionKey ? QueryMode : never;

/**
 * Add rendered content fields only if the collection is routable and mode is "full".
 *
 * @template T - The base type to potentially extend with rendered content.
 * @template K - The collection key to check for routability.
 * @template Mode - The query mode to check.
 *
 * @example
 * ```typescript
 * // For routable collection in full mode: adds RenderedContent
 * type BlogFull = AddRenderedContentIfApplicable<BaseType, "blog", "full">;
 *
 * // For non-routable collection: never adds RenderedContent regardless of mode
 * type AuthorFull = AddRenderedContentIfApplicable<BaseType, "authors", "full">;
 *
 * // For routable collection in preview mode: doesn't add RenderedContent
 * type BlogPreview = AddRenderedContentIfApplicable<BaseType, "blog", "preview">;
 * ```
 */
type AddRenderedContentIfApplicable<T, K, Mode> =
  K extends RoutableCollectionKey
    ? Mode extends "full"
      ? T & Omit<RenderedContent, "remarkPluginFrontmatter">
      : T
    : T;

/**
 * Add both computed fields (if routable) and rendered content (if routable +
 * full mode).
 *
 * @template T - The base type to extend.
 * @template K - The collection key to check for routability.
 * @template Mode - The query mode to check.
 */
type AddCollectionFeatures<T, K, Mode> = AddRenderedContentIfApplicable<
  AddComputedFieldsIfRoutable<T, K>,
  K,
  Mode
>;

type UpdatedMetaPropertiesTypes = {
  authors: AuthorLink[];
  category: Route | null;
  tags: Route[] | null;
};

type UpdatedRootPropertiesTypes = {
  avatar: Img | null | undefined;
  cover: Img | null | undefined;
  seo: SEO;
};

/**
 * Transform the meta object of a collection entry data.
 * Removes specific fields, patches existing properties, and adds remark plugin data.
 *
 * @template T - The collection entry data type to transform.
 */
type TransformMeta<T extends CollectionEntry<CollectionKey>["data"]> =
  "meta" extends keyof T
    ? {
        meta: PatchExistingProperties<
          Omit<T["meta"], "isDraft"> & RemarkPluginFrontmatterMeta,
          UpdatedMetaPropertiesTypes,
          true
        >;
      }
    : unknown;

/**
 * Transform root data for preview mode (excludes seo).
 *
 * @template T - The collection entry data type to transform.
 */
type TransformRootDataPreview<
  T extends CollectionEntry<CollectionKey>["data"],
> = PatchExistingProperties<
  Omit<T, "i18n" | "meta" | "seo">,
  UpdatedRootPropertiesTypes
>;

/**
 * Transform root data for full mode (includes seo).
 *
 * @template T - The collection entry data type to transform.
 */
type TransformRootDataFull<T extends CollectionEntry<CollectionKey>["data"]> =
  PatchExistingProperties<Omit<T, "i18n" | "meta">, UpdatedRootPropertiesTypes>;

/**
 * Conditionally transform root data based on collection type and mode.
 * Non-routable collections always get the "full" treatment (including seo).
 *
 * @template T - The collection entry data type to transform.
 * @template K - The collection key.
 * @template Mode - The query mode to check.
 */
type TransformRootDataConditional<
  T extends CollectionEntry<CollectionKey>["data"],
  K extends CollectionKey,
  Mode extends QueryMode,
> = K extends RoutableCollectionKey
  ? Mode extends "full"
    ? TransformRootDataFull<T>
    : TransformRootDataPreview<T>
  : TransformRootDataFull<T>; // Non-routable collections always get full data

/**
 * The main entry type that represents a queried and transformed collection entry.
 * Applies all transformations and conditionally adds routable collection features.
 *
 * @template T - The collection key type.
 * @template Mode - The query mode ("preview" or "full" for routable collections).
 *
 * @example
 * ```typescript
 * // Routable collection with full content
 * type BlogPost = FormattedEntry<"blog.posts", "full">;
 *
 * // Routable collection with preview (no rendered content)
 * type BlogPreview = FormattedEntry<"blog.posts", "preview">;
 *
 * // Non-routable collection (mode not applicable)
 * type Author = FormattedEntry<"authors">;
 * ```
 */
export type FormattedEntry<
  T extends CollectionKey,
  Mode extends ValidQueryMode<T> = T extends RoutableCollectionKey
    ? "preview"
    : never,
> = AddCollectionFeatures<
  Pick<CollectionEntry<T>, "collection" | "id"> &
    TransformRootDataConditional<CollectionEntry<T>["data"], T, Mode> &
    TransformMeta<CollectionEntry<T>["data"]>,
  T,
  Mode
>;

export type Author = FormattedEntry<"authors">;
export type AuthorPreview = Omit<
  Author,
  "email" | "firstName" | "firstNameIPA" | "lastName" | "lastNameIPA"
>;
export type AuthorLink = Pick<Author, "isWebsiteOwner" | "name" | "website">;

export type BlogCategory<M extends QueryMode = "full"> = FormattedEntry<
  "blog.categories",
  M
>;
export type BlogPost<M extends QueryMode = "full"> = FormattedEntry<
  "blog.posts",
  M
>;
export type Blog = FormattedEntry<"blogroll">;
export type Bookmark = FormattedEntry<"bookmarks">;
export type Guide<M extends QueryMode = "full"> = FormattedEntry<"guides", M>;
export type IndexPage<M extends QueryMode = "full"> = FormattedEntry<
  "index.pages",
  M
>;
export type Note<M extends QueryMode = "full"> = FormattedEntry<"notes", M>;
export type Page<M extends QueryMode = "full"> = FormattedEntry<"pages", M>;
export type Project<M extends QueryMode = "full"> = FormattedEntry<
  "projects",
  M
>;
export type Tag<M extends QueryMode = "full"> = FormattedEntry<"tags", M>;
export type TaxonomyCollectionKey = "blog.categories" | "tags";
export type Taxonomy<M extends QueryMode = "full"> = BlogCategory<M> | Tag<M>;

export type FeedCompatibleEntry =
  | Blog
  | BlogPost
  | Bookmark
  | Guide
  | Note
  | Project
  | Taxonomy;
