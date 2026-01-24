export type AllKeysOf<T> = T extends unknown ? keyof T : never;

export type AllowOnly<T, K extends keyof T> = Pick<T, K> & {
  [P in keyof Omit<T, K>]?: never;
};
export type OneOf<T, K = keyof T> = K extends keyof T ? AllowOnly<T, K> : never;

/**
 * Navigate through a nested property path and return the final value type.
 * Returns `never` if any part of the path is invalid or doesn't exist.
 *
 * This utility recursively traverses object properties following the given
 * path. When the path is exhausted, it returns the type at that location.
 *
 * @template T - The type to navigate through.
 * @template Keys - A readonly tuple of property keys representing the path to follow.
 *
 * @example
 * ```typescript
 * type User = {
 *   profile: {
 *     settings: {
 *       theme: 'light' | 'dark';
 *       notifications: boolean;
 *     }
 *   }
 * };
 *
 * // Returns 'light' | 'dark'
 * type Theme = GetNestedValue<User, ["profile", "settings", "theme"]>;
 *
 * // Returns boolean
 * type Notifications = GetNestedValue<User, ["profile", "settings", "notifications"]>;
 *
 * // Returns never (invalid path)
 * type Invalid = GetNestedValue<User, ["profile", "nonexistent", "theme"]>;
 * ```
 */
type GetNestedValue<T, Keys extends readonly PropertyKey[]> = Keys extends [
  infer K,
  ...infer Rest,
]
  ? K extends keyof T
    ? Rest extends PropertyKey[]
      ? GetNestedValue<T[K], Rest>
      : never
    : never
  : T;

/**
 * Check if a type has a nested property path and return the original type if
 * it exists. Returns `never` if any part of the path doesn't exist.
 *
 * This is useful for conditional types where you only want to operate on
 * objects that have a specific nested structure.
 *
 * @template T - The type to check for the nested property path.
 * @template Keys - A readonly tuple of property keys representing the path to check.
 *
 * @example
 * ```typescript
 * type User = { profile: { settings: { theme: string } } };
 * type Post = { title: string; content: string };
 *
 * // Returns User (the path exists)
 * type UserWithSettings = HasNestedKey<User, ["profile", "settings", "theme"]>;
 *
 * // Returns never (the path doesn't exist)
 * type PostWithSettings = HasNestedKey<Post, ["profile", "settings", "theme"]>;
 * ```
 */
export type HasNestedKey<T, Keys extends readonly PropertyKey[]> =
  GetNestedValue<T, Keys> extends never ? never : T;

/**
 * Create an union of object keys where the value matches the given type.
 *
 * @template T, V
 */
export type KeyOfType<T, V> = {
  [K in keyof T]: K extends string ? (T[K] extends V ? K : never) : never;
}[keyof T];

type AnyString = string & Record<never, never>;

/**
 * Provide autocompletion from a string literal type while allowing any string.
 *
 * @template T
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

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type RequireOnly<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>>;

/**
 * Replace properties that exist in both types, preserving the original
 * structure. Only properties present in T will be included in the result.
 *
 * @template O - The source object type to patch.
 * @template U - The replacement types for matching properties.
 *
 * @example
 * ```typescript
 * type Original = { name?: string; age: number; id: string };
 * type Replacements = { name: CustomName; age: CustomAge };
 * // Result: { name?: CustomName; age: CustomAge; id: string }
 * type Result = ReplaceIfPropExistsPreserveOptional<Original, Replacements>;
 * ```
 */
type ReplaceIfPropExistsPreserveOptional<O, U> = Omit<O, keyof U> & {
  [K in keyof O as K extends keyof U ? K : never]: K extends keyof U
    ? U[K]
    : never;
};

/**
 * Preserve null unions from the original type when they exist. If a property
 * in T was `SomeType | null`, the result will be `NewType | null`.
 *
 * @template O - The reference type to check for null unions.
 * @template U - The result type to potentially add null to.
 *
 * @example
 * ```typescript
 * type Original = { name: string | null; age: number };
 * type Updated = { name: CustomName; age: CustomAge };
 * // Result: { name: CustomName | null; age: CustomAge }
 * type Result = PreserveNullUnion<Original, Updated>;
 * ```
 */
type PreserveNullUnion<O, U> = {
  [K in keyof U]: K extends keyof O
    ? null extends O[K]
      ? U[K] | null
      : U[K]
    : U[K];
};

/**
 * Preserve undefined unions from the original type when they exist. If a
 * property in T was `SomeType | undefined`, the result will be `NewType |
 * undefined`. Note: This is different from optional properties (name?: Type).
 *
 * @template O - The reference type to check for undefined unions.
 * @template U - The result type to potentially add undefined to.
 *
 * @example
 * ```typescript
 * type Original = { name: string | undefined; age: number };
 * type Updated = { name: CustomName; age: CustomAge };
 * // Result: { name: CustomName | undefined; age: CustomAge }
 * type Result = PreserveUndefinedUnion<Original, Updated>;
 * ```
 */
type PreserveUndefinedUnion<O, U> = {
  [K in keyof U]: K extends keyof O
    ? undefined extends O[K]
      ? U[K] | undefined
      : U[K]
    : U[K];
};

/**
 * Preserve both `null` and `undefined` unions from the original type.
 * Combines the behavior of `PreserveNullUnion` and `PreserveUndefinedUnion`.
 *
 * @template O - The reference type to check for nullish unions.
 * @template U - The result type to potentially add nullish types to.
 *
 * @example
 * ```typescript
 * type Original = { name: string | null | undefined; age: number };
 * type Updated = { name: CustomName; age: CustomAge };
 * // Result: { name: CustomName | null | undefined; age: CustomAge }
 * type Result = PreserveNullishUnions<Original, Updated>;
 * ```
 */
type PreserveNullishUnions<O, U> = PreserveNullUnion<
  O,
  PreserveUndefinedUnion<O, U>
>;

/**
 * Patch the properties in common with the given type while optionally
 * preserving the original nullability and optionality.
 *
 * @template O - The initial object to patch.
 * @template U - The properties to replace with their new types.
 * @template P - Whether to preserve null and undefined unions (default: false).
 *
 * @example
 * ```typescript
 * type Original = { name: string | undefined; age?: number | null; id: string };
 * type Replacements = { name: CustomName; age: CustomAge };
 * // Result1: { name: CustomName; age?: CustomAge; id: string }
 * type Result1 = PatchExistingProperties<Original, Replacements>;
 * // Result2: { name: CustomName | undefined; age?: CustomAge | null; id: string }
 * type Result2 = PatchExistingProperties<Original, Replacements, true>;
 * ```
 */
export type PatchExistingProperties<O, U, P extends boolean = false> = Expand<
  P extends true
    ? PreserveNullishUnions<O, ReplaceIfPropExistsPreserveOptional<O, U>>
    : ReplaceIfPropExistsPreserveOptional<O, U>
>;

/**
 * Conditionally add fields to a type based on whether a key extends a constraint.
 * Returns the original type intersected with the additional fields if the constraint
 * is met, otherwise returns just the original type.
 *
 * @template T - The base type to potentially extend.
 * @template K - The key to check against the constraint.
 * @template Constraint - The constraint that K must extend.
 * @template Fields - The fields to add if the constraint is satisfied.
 *
 * @example
 * ```typescript
 * type RoutableCollectionKey = "blog" | "docs";
 * type NonRoutableCollectionKey = "authors" | "tags";
 * type CollectionKey = RoutableCollectionKey | NonRoutableCollectionKey;
 *
 * type ComputedFields = { slug: string; permalink: string };
 *
 * // For routable collections, adds ComputedFields
 * type BlogEntry = ConditionallyExtend<
 *   { title: string },
 *   "blog",
 *   RoutableCollectionKey,
 *   ComputedFields
 * >; // Result: { title: string } & ComputedFields
 *
 * // For non-routable collections, doesn't add ComputedFields
 * type AuthorEntry = ConditionallyExtend<
 *   { name: string },
 *   "authors",
 *   RoutableCollectionKey,
 *   ComputedFields
 * >; // Result: { name: string }
 * ```
 */
export type ConditionallyExtend<T, K, Constraint, Fields> = K extends Constraint
  ? T & Fields
  : T;
