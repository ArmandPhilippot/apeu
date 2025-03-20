import type { CollectionEntry, CollectionKey } from "astro:content";
import type { HasNestedKey } from "../../../../types/utilities";
import { isObject } from "../../../../utils/type-checks";
import type { QueryCollectionWhere } from "./types";

type CollectionEntryWithMeta<C extends CollectionKey> = HasNestedKey<
  CollectionEntry<C>,
  "data",
  "meta"
>;

const hasDraftProperty = <C extends CollectionKey>(
  entry: CollectionEntry<C>
): entry is CollectionEntry<C> & { data: { meta: { isDraft?: boolean } } } =>
  "meta" in entry.data && "isDraft" in entry.data.meta;

const isDraftOnProd = (
  entry: CollectionEntryWithMeta<CollectionKey>
): boolean => {
  if (!hasDraftProperty(entry) || !import.meta.env.PROD) return false;

  return entry.data.meta.isDraft;
};

const matchesAuthors = (
  entry: CollectionEntryWithMeta<CollectionKey>,
  authors?: string[]
): boolean => {
  if (authors === undefined) return true;
  if (authors.length === 0 || !("authors" in entry.data.meta)) return false;

  return entry.data.meta.authors.some((ref) => authors.includes(ref.id));
};

const matchesCategories = (
  entry: CollectionEntryWithMeta<CollectionKey>,
  categories?: string[]
): boolean => {
  if (categories === undefined || categories.length === 0) return true;

  return (
    "category" in entry.data.meta &&
    categories.includes(entry.data.meta.category.id)
  );
};

const matchesIds = (
  entry: CollectionEntry<CollectionKey>,
  ids?: string[]
): boolean => ids === undefined || ids.length === 0 || ids.includes(entry.id);

const matchesLocale = (
  entry: CollectionEntry<CollectionKey>,
  locale?: string
): boolean => {
  if (locale === undefined) return true;

  const hasNoLocaleInfo =
    (!("description" in entry.data) || !isObject(entry.data.description)) &&
    !("locale" in entry.data);
  const descriptionMatches =
    "description" in entry.data &&
    isObject(entry.data.description) &&
    locale in entry.data.description;
  const localePropertyMatches =
    "locale" in entry.data && entry.data.locale === locale;

  return hasNoLocaleInfo || descriptionMatches || localePropertyMatches;
};

const matchesTags = (
  entry: CollectionEntryWithMeta<CollectionKey>,
  tags?: string[]
): boolean => {
  if (tags === undefined || tags.length === 0) return true;

  return (
    "tags" in entry.data.meta &&
    Array.isArray(entry.data.meta.tags) &&
    entry.data.meta.tags.some((ref) => tags.includes(ref.id))
  );
};

const hasMetaProperty = <C extends CollectionKey>(
  entry: CollectionEntry<C>
): entry is CollectionEntryWithMeta<C> => "meta" in entry.data;

const matchesFilter = <C extends CollectionKey>(
  entry: CollectionEntryWithMeta<C>,
  filters: Partial<QueryCollectionWhere>
): boolean => {
  const { authors, categories, ids, locale, tags } = filters;

  return (
    matchesAuthors(entry, authors) &&
    matchesCategories(entry, categories) &&
    matchesIds(entry, ids) &&
    matchesLocale(entry, locale) &&
    matchesTags(entry, tags) &&
    !isDraftOnProd(entry)
  );
};

/**
 * Apply the given filters to a content collection.
 *
 * @param {Partial<QueryCollectionWhere>} [filters] - The filters to apply.
 * @returns {(entry: CollectionEntry<CollectionKey>) => boolean} A function accepting a collection entry that will be use against filters.
 */
export const applyCollectionFilters =
  (
    filters: Partial<QueryCollectionWhere> = {}
  ): ((entry: CollectionEntry<CollectionKey>) => boolean) =>
  (entry: CollectionEntry<CollectionKey>) => {
    if (hasMetaProperty(entry)) return matchesFilter(entry, filters);
    return (
      matchesIds(entry, filters.ids) && matchesLocale(entry, filters.locale)
    );
  };
