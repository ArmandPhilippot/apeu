import type {
  AllValuesOf,
  DataCollectionKey,
  DataEntryMap,
} from "astro:content";

type ValidDataEntryId<C extends keyof DataEntryMap> = AllValuesOf<
  DataEntryMap[C]
>["id"];

export type CollectionReference<C extends DataCollectionKey> = {
  collection: C;
  id: ValidDataEntryId<C>;
};

/**
 * Create an union of object keys where the value matches the given type.
 */
export type KeyOfType<T, V> = {
  [K in keyof T]: K extends string ? (T[K] extends V ? K : never) : never;
}[keyof T];

type AnyString = string & Record<never, never>;

/**
 * Provide autocompletion from a string literal type while allowing any string.
 */
export type LooseAutocomplete<T extends string> = T | AnyString;
