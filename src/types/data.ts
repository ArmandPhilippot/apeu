import type { LocalImageProps, RemoteImageProps } from "astro:assets";
import type { CollectionEntry, RenderResult } from "astro:content";

type RenderedContent = RenderResult & {
  hasContent: boolean;
};

export type Author = Pick<CollectionEntry<"authors">, "collection" | "id"> &
  Omit<CollectionEntry<"authors">["data"], "avatar"> & {
    avatar?: Omit<Img, "alt"> | null | undefined;
  };

export type AuthorLink = Pick<Author, "isWebsiteOwner" | "name" | "website">;

export type AuthorPreview = Omit<
  Author,
  "email" | "firstName" | "firstNameIPA" | "lastName" | "lastNameIPA"
>;

export type HeadingNode = {
  children?: HeadingNode[] | null | undefined;
  label: string;
  slug: string;
};

export type HTTPStatus = {
  CODE: number;
  TEXT: string;
};

export type Img = LocalImageProps | RemoteImageProps;

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
  CollectionEntry<"blogPosts">["data"]["meta"],
  "authors" | "category" | "isDraft" | "tags"
> & {
  authors: AuthorLink[];
  category?: TaxonomyLink | null | undefined;
  tags?: TaxonomyLink[] | null | undefined;
};

export type BlogPost = Pick<CollectionEntry<"blogPosts">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"blogPosts">["data"], "meta"> & {
    meta: BlogPostMetaData;
  };

export type BlogPostPreview = Omit<
  BlogPost,
  keyof RenderedContent | "meta" | "seo" | "slug"
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
> & {
  authors: AuthorLink[];
  tags?: TaxonomyLink[] | null | undefined;
};

export type Guide = Pick<CollectionEntry<"guides">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"guides">["data"], "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: GuideMetaData;
  };

export type GuidePreview = Omit<
  Guide,
  keyof RenderedContent | "meta" | "seo" | "slug"
> & {
  meta: Omit<GuideMetaData, "authors">;
};

export type NoteMetaData = Omit<
  CollectionEntry<"notes">["data"]["meta"],
  "isDraft" | "tags"
> & {
  tags?: TaxonomyLink[] | null | undefined;
};

export type Note = Pick<CollectionEntry<"notes">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"notes">["data"], "meta"> & {
    meta: NoteMetaData;
  };

export type NotePreview = Omit<Note, keyof RenderedContent | "seo" | "slug">;

export type PageMetaData = Omit<
  CollectionEntry<"pages">["data"]["meta"],
  "isDraft"
>;

export type Page = Pick<CollectionEntry<"pages">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"pages">["data"], "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: PageMetaData;
  };

export type PagePreview = Omit<Page, keyof RenderedContent | "seo" | "slug">;

export type ProjectMetaData = Omit<
  CollectionEntry<"projects">["data"]["meta"],
  "isDraft" | "tags"
> & {
  tags?: TaxonomyLink[] | null | undefined;
};

export type Project = Pick<CollectionEntry<"projects">, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<CollectionEntry<"projects">["data"], "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: ProjectMetaData;
  };

export type ProjectPreview = Omit<
  Project,
  keyof RenderedContent | "seo" | "slug"
>;

export type RawTaxonomyEntry = CollectionEntry<"blogCategories" | "tags">;

export type TaxonomyMetaData = Omit<
  RawTaxonomyEntry["data"]["meta"],
  "isDraft"
>;

export type Taxonomy = Pick<RawTaxonomyEntry, "collection" | "id"> &
  Omit<RenderedContent, "remarkPluginFrontmatter"> &
  Omit<RawTaxonomyEntry["data"], "cover" | "meta"> & {
    cover?: Img | null | undefined;
    meta: TaxonomyMetaData;
  };

export type TaxonomyLink = Pick<Taxonomy, "route" | "title">;

export type TaxonomyPreview = Omit<
  Taxonomy,
  keyof RenderedContent | "seo" | "slug"
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
