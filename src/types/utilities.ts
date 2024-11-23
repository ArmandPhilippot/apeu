import type {
  AllValuesOf,
  DataCollectionKey,
  DataEntryMap,
} from "astro:content";

export type AllKeysOf<T> = T extends unknown ? keyof T : never;

type ValidDataEntryId<C extends keyof DataEntryMap> = AllValuesOf<
  DataEntryMap[C]
>["id"];

export type CollectionReference<C extends DataCollectionKey> = {
  collection: C;
  id: ValidDataEntryId<C>;
};

export type HasKey<T, K extends PropertyKey> = T extends { [P in K]: unknown }
  ? T
  : never;

export type HasNestedKey<U, K1 extends PropertyKey, K2 extends PropertyKey> =
  U extends HasKey<U, K1>
    ? U[K1] extends HasKey<U[K1], K2>
      ? U
      : never
    : never;

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

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Blend<T> = Partial<UnionToIntersection<T>>;

type OmitNever<T extends Record<string, unknown>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type SharedShape<T1, T2> = OmitNever<Pick<T1 & T2, keyof T1 & keyof T2>>;
