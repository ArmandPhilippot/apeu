import type { NonRoutableCollectionKey, RoutableCollectionKey } from "./types";

export const ROUTABLE_COLLECTIONS = [
  "blog.categories",
  "blog.posts",
  "guides",
  "index.pages",
  "notes",
  "pages",
  "projects",
  "tags",
] as const satisfies RoutableCollectionKey[];

export const NON_ROUTABLE_COLLECTIONS = [
  "authors",
  "blogroll",
  "bookmarks",
] as const satisfies NonRoutableCollectionKey[];
