import type {
  CollectionEntry,
  CollectionKey,
  DataCollectionKey,
} from "astro:content";

type ValidDataEntryId<C extends CollectionKey> = CollectionEntry<C>["id"];

export type CollectionReference<C extends DataCollectionKey> = {
  collection: C;
  id: ValidDataEntryId<C>;
};

export type NonRoutableCollectionKey = Extract<
  CollectionKey,
  "authors" | "blogroll" | "bookmarks"
>;

export type RoutableCollectionKey = Exclude<
  CollectionKey,
  NonRoutableCollectionKey
>;

export type RoutableIndexedEntry<C extends RoutableCollectionKey> = {
  raw: CollectionEntry<C>;
  route: string;
  slug: string;
};

export type NonRoutableIndexedEntry<C extends NonRoutableCollectionKey> = {
  raw: CollectionEntry<C>;
};

export type IndexedEntry<C extends CollectionKey> =
  C extends RoutableCollectionKey
    ? RoutableIndexedEntry<C>
    : C extends NonRoutableCollectionKey
      ? NonRoutableIndexedEntry<C>
      : never;
