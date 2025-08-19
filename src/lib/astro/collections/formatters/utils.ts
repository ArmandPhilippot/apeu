import type { CollectionKey } from "astro:content";
import type {
  AltLanguage,
  ReadingTime,
  RemarkPluginFrontmatterMeta,
  TaxonomyLink,
} from "../../../../types/data";
import type { IndexedEntry } from "../types";
import type { AvailableLocale } from "../../../../types/tokens";
import type { CollectionReference } from "../../../../types/utilities";
import { WORDS_PER_MINUTE } from "../../../../utils/constants";
import { toUpperCase } from "../../../../utils/strings";
import {
  isAvailableLocale,
  isNumber,
  isString,
} from "../../../../utils/type-guards";
import type { EntryByIdIndex } from "../indexes";
import { isInCollection, isRoutableIndexedEntry } from "../type-guards";

/**
 * Retrieve the reading time rounded in minutes and seconds.
 *
 * @param {number} wordsCount - The number of words.
 * @param {number} wordsPerMinute - The reading fluency.
 * @returns {{minutes: number, seconds: number}} The reading time as object.
 */
const getReadingTimeInMinutesAndSeconds = (
  wordsCount: number,
  wordsPerMinute: number
): { minutes: number; seconds: number } => {
  const oneMinuteInSeconds = 60;
  const wordsPerSecond = wordsPerMinute / oneMinuteInSeconds;
  const estimatedTimeInSeconds = wordsCount / wordsPerSecond;
  const estimatedTimeInMinutes = Math.floor(
    estimatedTimeInSeconds / oneMinuteInSeconds
  );

  return {
    minutes: estimatedTimeInMinutes,
    seconds: Math.round(
      estimatedTimeInSeconds - estimatedTimeInMinutes * oneMinuteInSeconds
    ),
  };
};

const twoDecimals = 2;

/**
 * Retrieve the reading time rounded in minutes.
 *
 * @param {number} wordsCount - The number of words.
 * @param {number} wordsPerMinute - The reading fluency.
 * @returns {number} A number representing the reading time in minutes.
 */
const getReadingTimeInMinutes = (
  wordsCount: number,
  wordsPerMinute: number
): number =>
  Math.round(
    Number.parseFloat((wordsCount / wordsPerMinute).toFixed(twoDecimals))
  );

/**
 * Retrieve the reading time depending on a words count.
 *
 * @template T - Should the seconds be included?
 * @param {number} wordsCount - The number of words.
 * @param {AvailableLocale} locale - The current language.
 * @returns {ReadingTime} A detailed reading time object.
 */
const getReadingTime = (
  wordsCount: number,
  locale: AvailableLocale
): ReadingTime => {
  const wordsPerMinute = WORDS_PER_MINUTE[toUpperCase(locale)];

  return {
    inMinutes: getReadingTimeInMinutes(wordsCount, wordsPerMinute),
    inMinutesAndSeconds: getReadingTimeInMinutesAndSeconds(
      wordsCount,
      wordsPerMinute
    ),
    wordsCount,
    wordsPerMinute,
  };
};

/**
 * Retrieve the meta from Astro's remarkPluginFrontmatter.
 *
 * @param {Record<string, unknown>} remarkPluginFrontmatter - The Markdown frontmatter.
 * @param {AvailableLocale} locale - The current locale.
 * @returns {RemarkPluginFrontmatterMeta} The meta stored in the frontmatter.
 */
export const getMetaFromRemarkPluginFrontmatter = (
  remarkPluginFrontmatter: Record<string, unknown>,
  locale: AvailableLocale
): RemarkPluginFrontmatterMeta => {
  const readingTime = isNumber(remarkPluginFrontmatter.wordsCount)
    ? getReadingTime(remarkPluginFrontmatter.wordsCount, locale)
    : undefined;

  return {
    readingTime,
  };
};

/**
 * Convert a taxonomy indexed entry to a TaxonomyLink object.
 *
 * @param {IndexedEntry<"blog.categories" | "tags">} taxonomy - The taxonomy indexed entry.
 * @returns {Promise<TaxonomyLink>} An object describing the taxonomy link.
 */
export const getTaxonomyLink = (
  taxonomy: IndexedEntry<"blog.categories" | "tags">
): TaxonomyLink => {
  const { route, raw } = taxonomy;

  return {
    route,
    title: raw.data.title,
  };
};

/**
 * Retrieve full entries from content collection references.
 *
 * @template C
 * @param {CollectionReference<C>[] | undefined} references - The content collection references.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {IndexedEntry<C>[] | null} The resolved references or null.
 */
export const resolveReferences = <C extends CollectionKey>(
  references: CollectionReference<C>[] | undefined,
  indexById: EntryByIdIndex
): IndexedEntry<C>[] | null => {
  if (references === undefined || references.length === 0) return null;

  const entries = references
    .map((reference) => {
      const entry = indexById.get(reference.id);
      return entry !== undefined && isInCollection(entry, reference.collection)
        ? entry
        : null;
    })
    .filter((entry) => entry !== null);

  return entries;
};

/**
 * Retrieve a category link from a `blog.categories` reference.
 *
 * @param {CollectionReference<"blog.categories"> | undefined} reference - A `blog.categories` reference.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {TaxonomyLink | null} An object describing the category link or null.
 */
export const getCategoryFromReference = (
  reference: CollectionReference<"blog.categories"> | undefined,
  indexById: EntryByIdIndex
): TaxonomyLink | null => {
  if (reference === undefined) return null;

  const category = indexById.get(reference.id);

  return category !== undefined &&
    isInCollection(category, reference.collection)
    ? getTaxonomyLink(category)
    : null;
};

/**
 * Retrieve the tags links from a list of `tags` references.
 *
 * @param {CollectionReference<"tags">[] | undefined} references - An array of `tags` references.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {TaxonomyLink[] | null} An array of objects describing the tags links.
 */
export const getTagsFromReferences = (
  references: CollectionReference<"tags">[] | undefined,
  indexById: EntryByIdIndex
): TaxonomyLink[] | null => {
  const resolvedTags = resolveReferences(references, indexById);

  return resolvedTags?.map(getTaxonomyLink) ?? null;
};

/**
 * Transform a single translation entry into a typed key-value pair.
 *
 * @template C - The collection key.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {(kv: [string, CollectionReference<C>]) => AltLanguage | null} An alternative language.
 */
const resolveTranslationEntry =
  (
    indexById: EntryByIdIndex
  ): (<C extends CollectionKey>(
    kv: [string, CollectionReference<C>]
  ) => AltLanguage | null) =>
  ([lang, reference]): AltLanguage | null => {
    if (!isAvailableLocale(lang)) return null;

    const translation = indexById.get(reference.id);
    const route =
      translation !== undefined && isRoutableIndexedEntry(translation)
        ? translation.route
        : null;
    return isString(route) ? { locale: lang, route } : null;
  };

type Translations<C extends CollectionKey> = Partial<
  Record<AvailableLocale, CollectionReference<C>>
>;

/**
 * Resolve an object of translations references to an object of routes.
 *
 * @template C
 * @param {Translations<C> | undefined} translations - An object.
 * @param {EntryByIdIndex} indexById - A map of indexed entries by id.
 * @returns {Promise<AltLanguage[] | null>} The resolved translations.
 */
export const resolveTranslations = async <C extends CollectionKey>(
  translations: Translations<C> | undefined,
  indexById: EntryByIdIndex
): Promise<AltLanguage[] | null> => {
  if (translations === undefined) return null;

  const resolvedEntries = await Promise.all(
    Object.entries(translations).map(resolveTranslationEntry(indexById))
  );
  const validEntries = resolvedEntries.filter(
    (entry): entry is AltLanguage => entry !== null
  );

  return validEntries.length > 0 ? validEntries : null;
};
