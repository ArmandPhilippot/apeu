import type { RoutableCollectionKey } from "./types";

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
