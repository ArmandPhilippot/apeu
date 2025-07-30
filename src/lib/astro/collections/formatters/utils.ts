import {
  getEntries,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import type {
  AltLanguage,
  RawTaxonomyEntry,
  TaxonomyLink,
} from "../../../../types/data";
import type { CollectionReference } from "../../../../types/utilities";
import {
  isAvailableLanguage,
  type AvailableLanguage,
} from "../../../../utils/i18n";
import { isObject, isString } from "../../../../utils/type-checks";

/**
 * Convert a taxonomy collection entry to a TaxonomyLink object.
 *
 * @param {RawTaxonomyEntry} taxonomy - The taxonomy collection entry.
 * @returns {Promise<TaxonomyLink>} An object describing the taxonomy link.
 */
export const getTaxonomyLink = (taxonomy: RawTaxonomyEntry): TaxonomyLink => {
  const { route, title } = taxonomy.data;

  return {
    route,
    title,
  };
};

/**
 * Retrieve full entries from content collection references.
 *
 * @template C
 * @param {CollectionReference<C>[] | undefined} references - The content collection references.
 * @returns {Promise<CollectionEntry<C>[] | null>} The resolved references or null.
 */
export const resolveReferences = async <C extends CollectionKey>(
  references: CollectionReference<C>[] | undefined
): Promise<CollectionEntry<C>[] | null> => {
  if (references === undefined || references.length === 0) return null;

  const entries = await getEntries(references);

  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --
   * The type returned from `getEntries` is wrong: when the id does not match
   * an entry, it returns an array with `undefined` as child. */
  return entries.filter((entry) => entry !== undefined);
};

/**
 * Retrieve a category link from a `blog.categories` reference.
 *
 * @param {CollectionReference<"blog.categories"> | undefined} reference - A `blog.categories` reference.
 * @returns {Promise<TaxonomyLink | null>} An object describing the category link or null.
 */
export const getCategoryFromReference = async (
  reference: CollectionReference<"blog.categories"> | undefined
): Promise<TaxonomyLink | null> => {
  if (reference === undefined) return null;

  const category = await getEntry(reference);

  return isObject(category) ? getTaxonomyLink(category) : null;
};

/**
 * Retrieve the tags links from a list of `tags` references.
 *
 * @param {CollectionReference<"tags">[] | undefined} references - An array of `tags` references.
 * @returns {Promise<TaxonomyLink[] | null>} An array of objects describing the tags links.
 */
export const getTagsFromReferences = async (
  references: CollectionReference<"tags">[] | undefined
): Promise<TaxonomyLink[] | null> => {
  const resolvedTags = await resolveReferences(references);

  return resolvedTags?.map(getTaxonomyLink) ?? null;
};

/**
 * Type guard to check if an entry has required data properties.
 *
 * @param {unknown} entry - A collection entry.
 * @returns {boolean} True when the entry have a route.
 */
const hasRouteData = (entry: unknown): entry is { data: { route: string } } =>
  entry !== null &&
  typeof entry === "object" &&
  "data" in entry &&
  typeof entry.data === "object" &&
  entry.data !== null &&
  "route" in entry.data;

/**
 * Resolve the route of a single translation reference.
 *
 * @template C
 * @param {CollectionReference<C> | undefined} reference - A reference.
 * @returns {Promise<string | null>} The route of the entry or null.
 */
const getTranslationRoute = async <C extends CollectionKey>(
  reference: CollectionReference<C> | undefined
): Promise<string | null> => {
  if (reference === undefined) return null;
  const entry = await getEntry(reference);

  return hasRouteData(entry) ? entry.data.route : null;
};

/**
 * Transform a single translation entry into a typed key-value pair.
 *
 * @template C
 * @param {[AvailableLanguage, CollectionReference<C>]} kv - A key-value pair.
 * @returns {Promise<AltLanguage | null>} An alternative language.
 */
const resolveTranslationEntry = async <C extends CollectionKey>([
  lang,
  reference,
]: [string, CollectionReference<C>]): Promise<AltLanguage | null> => {
  if (!isAvailableLanguage(lang)) return null;

  const route = await getTranslationRoute(reference);
  return isString(route) ? { locale: lang, route } : null;
};

type Translations<C extends CollectionKey> = Partial<
  Record<AvailableLanguage, CollectionReference<C>>
>;

/**
 * Resolve an object of translations references to an object of routes.
 *
 * @template C
 * @param {Translations<C> | undefined} translations - An object.
 * @returns {Promise<AltLanguage[] | null>} The resolved translations.
 */
export const resolveTranslations = async <C extends CollectionKey>(
  translations: Translations<C> | undefined
): Promise<AltLanguage[] | null> => {
  if (translations === undefined) return null;

  const resolvedEntries = await Promise.all(
    Object.entries(translations).map(resolveTranslationEntry)
  );
  const validEntries = resolvedEntries.filter(
    (entry): entry is AltLanguage => entry !== null
  );

  return validEntries.length > 0 ? validEntries : null;
};
