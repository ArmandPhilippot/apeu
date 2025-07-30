import type { CollectionKey } from "astro:content";

export type NonRoutableCollectionKey = Extract<
  CollectionKey,
  "authors" | "blogroll" | "bookmarks"
>;

export type RoutableCollectionKey = Exclude<
  CollectionKey,
  NonRoutableCollectionKey
>;
