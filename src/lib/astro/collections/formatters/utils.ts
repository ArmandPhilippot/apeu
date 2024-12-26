import { getEntries, getEntry, type CollectionKey } from "astro:content";
import type { AltLanguage } from "../../../../types/data";
import type { CollectionReference } from "../../../../types/utilities";
import {
  isAvailableLanguage,
  type AvailableLanguage,
} from "../../../../utils/i18n";
import { getTaxonomyLink } from "./taxonomies";

export const resolveReferences = async <C extends CollectionKey>(
  references: CollectionReference<C>[] | undefined,
) => {
  if (!references?.length) return null;

  const entries = await getEntries(references);

  /* The type returned from `getEntries` is wrong: when the id does not match
   * an entry, it returns an array with `undefined` as child. */
  return entries.filter((entry) => entry !== undefined);
};

export const getCategoryFromReference = async (
  reference: CollectionReference<"blogCategories"> | undefined,
) => {
  const category = reference ? await getEntry(reference) : null;

  return category ? getTaxonomyLink(category) : null;
};

export const getTagsFromReferences = async (
  references: CollectionReference<"tags">[] | undefined,
) => {
  const resolvedTags = await resolveReferences(references);

  return resolvedTags ? resolvedTags.map(getTaxonomyLink) : null;
};

/**
 * Type guard to check if an entry has required data properties
 *
 * @param {unknown} entry - A collection entry.
 * @returns {boolean} True when the entry have a route.
 */
const hasRouteData = (entry: unknown): entry is { data: { route: string } } => {
  return (
    entry !== null &&
    typeof entry === "object" &&
    "data" in entry &&
    typeof entry.data === "object" &&
    entry.data !== null &&
    "route" in entry.data
  );
};

/**
 * Resolve the route of a single translation reference.
 *
 * @param {CollectionReference<C> | undefined} reference - A reference.
 * @returns {Promise<string | null>} The route.
 */
const getTranslationRoute = async <C extends CollectionKey>(
  reference: CollectionReference<C> | undefined,
): Promise<string | null> => {
  if (!reference) return null;
  const entry = await getEntry(reference);

  return hasRouteData(entry) ? entry.data.route : null;
};

/**
 * Transform a single translation entry into a typed key-value pair.
 *
 * @param {[AvailableLanguage, CollectionReference<C>]} kv - A key-value pair
 * @returns {Promise<AltLanguage | null>} An alternative language.
 */
const resolveTranslationEntry = async <C extends CollectionKey>([
  lang,
  reference,
]: [string, CollectionReference<C>]): Promise<AltLanguage | null> => {
  if (!isAvailableLanguage(lang)) return null;

  const route = await getTranslationRoute(reference);
  return route ? { locale: lang, route } : null;
};

type Translations<C extends CollectionKey> = Partial<
  Record<AvailableLanguage, CollectionReference<C>>
>;

/**
 * Resolve an object of translations references to an object of routes.
 *
 * @param {Translations<C> | undefined} translations - An object
 * @returns {Promise<AltLanguage[] | null>} The resolved translations
 */
export const resolveTranslations = async <C extends CollectionKey>(
  translations: Translations<C> | undefined,
): Promise<AltLanguage[] | null> => {
  if (!translations) return null;

  const resolvedEntries = await Promise.all(
    Object.entries(translations).map(resolveTranslationEntry),
  );
  const validEntries = resolvedEntries.filter(
    (entry): entry is AltLanguage => entry !== null,
  );

  return validEntries.length > 0 ? validEntries : null;
};
