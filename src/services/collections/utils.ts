import type { CollectionKey } from "astro:content";
import type { IndexedEntry } from "../../types/routing";
import type { CollectionReference } from "../../types/utilities";

/**
 * Filter the given tags references by locale.
 *
 * @param {CollectionReference<"tags">[]} tags - The list of tags.
 * @param {string} locale - The target locale.
 * @returns {CollectionReference<"tags">[]} The filtered tags for the given locale.
 */
const filterTagsReferencesByLocale = (
  tags: CollectionReference<"tags">[],
  locale: string
): CollectionReference<"tags">[] =>
  tags.filter((tag) => tag.id.startsWith(`${locale}/`));

/**
 * Transform an entry to filter tags based on the provided locale.
 *
 * @template C - CollectionKey.
 * @param {IndexedEntry<C>} entry - The collection entry.
 * @param {string} locale - The locale to filter tags by.
 * @returns {IndexedEntry<C>} The transformed entry.
 */
export const updateEntryTagsForLocale = <C extends CollectionKey>(
  entry: IndexedEntry<C>,
  locale: string
): IndexedEntry<C> => {
  if (
    !("meta" in entry.raw.data) ||
    !("tags" in entry.raw.data.meta) ||
    entry.raw.data.meta.tags === undefined ||
    entry.raw.data.meta.tags.length === 0
  ) {
    return entry;
  }

  const filteredTags = filterTagsReferencesByLocale(
    entry.raw.data.meta.tags,
    locale
  );

  return {
    ...entry,
    raw: {
      ...entry.raw,
      data: {
        ...entry.raw.data,
        meta: {
          ...entry.raw.data.meta,
          tags: filteredTags,
        },
      },
    },
  };
};

/**
 * Transform the entries to filter tags based on the provided locale.
 *
 * @template C - CollectionKey.
 * @param {IndexedEntry<C>[]} entries - The collection entries.
 * @param {string} [locale] - The locale to filter tags by.
 * @returns {IndexedEntry<C>[]} The transformed entries.
 */
export const updateEntriesTagsForLocale = <C extends CollectionKey>(
  entries: IndexedEntry<C>[],
  locale?: string
): IndexedEntry<C>[] => {
  if (locale === undefined) return entries;

  return entries.map((entry) => updateEntryTagsForLocale(entry, locale));
};
