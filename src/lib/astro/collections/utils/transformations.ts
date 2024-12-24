import type { CollectionEntry, CollectionKey } from "astro:content";
import type { CollectionReference } from "../../../../types/utilities";

/**
 * Filter tags by locale.
 *
 * @param {CollectionReference<"tags">[]} tags - The list of tags.
 * @param {string} locale - The target locale.
 * @returns {CollectionReference<"tags">[]} The filtered tags for the given locale.
 */
const filterTagsReferencesByLocale = (
  tags: CollectionReference<"tags">[],
  locale: string,
): CollectionReference<"tags">[] => {
  return tags.filter((tag) => tag.id.startsWith(`${locale}/`));
};

/**
 * Transform an entry to filter tags based on the provided locale.
 *
 * @template C - CollectionKey
 * @param {CollectionEntry<C>} entry - The collection entry.
 * @param {string} locale - The locale to filter tags by.
 * @returns {CollectionEntry<C>} The transformed entry.
 */
export const updateEntryTagsForLocale = <C extends CollectionKey>(
  entry: CollectionEntry<C>,
  locale: string,
): CollectionEntry<C> => {
  if (
    !("meta" in entry.data) ||
    !("tags" in entry.data.meta) ||
    !entry.data.meta.tags?.length
  )
    return entry;

  const filteredTags = filterTagsReferencesByLocale(
    entry.data.meta.tags,
    locale,
  );

  return {
    ...entry,
    data: {
      ...entry.data,
      meta: {
        ...entry.data.meta,
        tags: filteredTags,
      },
    },
  };
};

/**
 * Transform the entries to filter tags based on the provided locale.
 *
 * @template C - CollectionKey
 * @param {CollectionEntry<C>[]} entries - The collection entries.
 * @param {string} [locale] - The locale to filter tags by.
 * @returns {CollectionEntry<C>[]} The transformed entries.
 */
export const updateEntriesTagsForLocale = <C extends CollectionKey>(
  entries: CollectionEntry<C>[],
  locale?: string,
): CollectionEntry<C>[] => {
  if (!locale) return entries;

  return entries.map((entry) => updateEntryTagsForLocale(entry, locale));
};
