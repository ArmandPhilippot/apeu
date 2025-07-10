import type { LocalImageProps, RemoteImageProps } from "astro:assets";
import type { CollectionEntry, RenderResult } from "astro:content";

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

export type AltLanguage = {
  locale: string;
  route: string;
};

export type SEO = {
  author?: Omit<AuthorLink, "isWebsiteOwner"> | null | undefined;
  canonical?: string | null | undefined;
  description?: string | undefined;
  languages?: AltLanguage[] | null | undefined;
  nofollow?: boolean | null | undefined;
  noindex?: boolean | null | undefined;
  title: string;
};

export type Author = Pick<CollectionEntry<"authors">, "collection" | "id"> &
  Omit<CollectionEntry<"authors">["data"], "avatar"> & {
    avatar?: Img | null | undefined;
  };

export type AuthorLink = Pick<Author, "isWebsiteOwner" | "name" | "website">;

export type AuthorPreview = Omit<
  Author,
  "email" | "firstName" | "firstNameIPA" | "lastName" | "lastNameIPA"
>;

export type Crumb = {
  label: string;
  url: string;
};

export type HeadingNode = {
  children?: HeadingNode[] | null | undefined;
  label: string;
  slug: string;
};

export type HTTPStatus = {
  CODE: number;
  TEXT: string;
};

export type Img = Omit<
  LocalImageProps | RemoteImageProps,
  "alt" | "width" | "height"
> & {
  alt?: string | null | undefined;
  height?: number | undefined;
  width?: number | undefined;
};

export type BlogMetaData = Omit<
  CollectionEntry<"blogroll">["data"]["meta"],
  "isDraft" | "tags"
> & {
  tags?: TaxonomyLink[] | null | undefined;
};

export type Blog = Pick<CollectionEntry<"blogroll">, "collection" | "id"> &
  Omit<CollectionEntry<"blogroll">["data"], "meta"> & {
    meta: BlogMetaData;
  };

export type BlogPostMetaData = Omit<
  CollectionEntry<"blog.posts">["data"]["meta"],
  "authors" | "category" | "isDraft" | "tags"
> &
  RemarkPluginFrontmatterMeta & {
    authors: AuthorLink[];
    category?: TaxonomyLink | null | undefined;
    tags?: TaxonomyLink[] | null | undefined;
  };

export type BlogPost = Pick<
  CollectionEntry<"blog.posts">,
  "collection" | "id"
> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"blog.posts">["data"], "cover" | "i18n" | "meta"> & {
    cover?: Img | null | undefined;
    meta: BlogPostMetaData;
    seo: SEO;
  };

export type BlogPostPreview = Omit<
  BlogPost,
  keyof RenderedContent | "i18n" | "meta" | "seo" | "slug"
> & {
  meta: Omit<BlogPostMetaData, "authors">;
};

export type BookmarkMetaData = Omit<
  CollectionEntry<"bookmarks">["data"]["meta"],
  "isDraft" | "tags"
> & {
  tags?: TaxonomyLink[] | null | undefined;
};

export type Bookmark = Pick<CollectionEntry<"bookmarks">, "collection" | "id"> &
  Omit<CollectionEntry<"bookmarks">["data"], "meta"> & {
    meta: BookmarkMetaData;
  };

export type GuideMetaData = Omit<
  CollectionEntry<"guides">["data"]["meta"],
  "authors" | "isDraft" | "tags"
> &
  RemarkPluginFrontmatterMeta & {
    authors: AuthorLink[];
    tags?: TaxonomyLink[] | null | undefined;
  };

export type Guide = Pick<CollectionEntry<"guides">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"guides">["data"], "i18n" | "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: GuideMetaData;
    seo: SEO;
  };

export type GuidePreview = Omit<
  Guide,
  keyof RenderedContent | "i18n" | "meta" | "seo" | "slug"
> & {
  meta: Omit<GuideMetaData, "authors">;
};

export type NoteMetaData = Omit<
  CollectionEntry<"notes">["data"]["meta"],
  "isDraft" | "tags"
> &
  RemarkPluginFrontmatterMeta & {
    tags?: TaxonomyLink[] | null | undefined;
  };

export type Note = Pick<CollectionEntry<"notes">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"notes">["data"], "i18n" | "meta"> & {
    meta: NoteMetaData;
    seo: SEO;
  };

export type NotePreview = Omit<
  Note,
  keyof RenderedContent | "i18n" | "seo" | "slug"
>;

export type IndexPageMetaData = Omit<
  CollectionEntry<"index.pages">["data"]["meta"],
  "isDraft"
> &
  RemarkPluginFrontmatterMeta;

export type IndexPage = Pick<
  CollectionEntry<"index.pages">,
  "collection" | "id"
> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"index.pages">["data"], "i18n" | "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: PageMetaData;
    seo: SEO;
  };

export type IndexPagePreview = Omit<
  IndexPage,
  keyof RenderedContent | "i18n" | "seo" | "slug"
>;

export type PageMetaData = Omit<
  CollectionEntry<"pages">["data"]["meta"],
  "isDraft"
> &
  RemarkPluginFrontmatterMeta;

export type Page = Pick<CollectionEntry<"pages">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"pages">["data"], "i18n" | "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: PageMetaData;
    seo: SEO;
  };

export type PagePreview = Omit<
  Page,
  keyof RenderedContent | "i18n" | "seo" | "slug"
>;

export type ProjectMetaData = Omit<
  CollectionEntry<"projects">["data"]["meta"],
  "isDraft" | "tags"
> &
  RemarkPluginFrontmatterMeta & {
    tags?: TaxonomyLink[] | null | undefined;
  };

export type Project = Pick<CollectionEntry<"projects">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"projects">["data"], "i18n" | "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: ProjectMetaData;
    seo: SEO;
  };

export type ProjectPreview = Omit<
  Project,
  keyof RenderedContent | "i18n" | "seo" | "slug"
>;

export type RawTaxonomyEntry = CollectionEntry<"blog.categories" | "tags">;

export type TaxonomyMetaData = Omit<
  RawTaxonomyEntry["data"]["meta"],
  "isDraft"
>;

export type Taxonomy = Pick<RawTaxonomyEntry, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<RawTaxonomyEntry["data"], "i18n" | "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: TaxonomyMetaData;
    seo: SEO;
  };

export type TaxonomyLink = Pick<Taxonomy, "route" | "title">;

export type TaxonomyPreview = Omit<
  Taxonomy,
  keyof RenderedContent | "i18n" | "seo" | "slug"
>;

export type CollectionMetaData =
  | BlogMetaData
  | BlogPostMetaData
  | BookmarkMetaData
  | GuideMetaData
  | NoteMetaData
  | PageMetaData
  | ProjectMetaData
  | TaxonomyMetaData;

export type FeedCompatibleEntry =
  | Blog
  | BlogPost
  | Bookmark
  | Guide
  | Note
  | Project
  | Taxonomy;
