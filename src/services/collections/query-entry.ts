import type { CollectionEntry, CollectionKey } from "astro:content";
import {
  formatEntry,
  type FormatEntryReturnMap,
} from "../../lib/astro/collections/formatters";
import { getEntriesIndex } from "../../lib/astro/collections/indexes";
import { isInCollection } from "../../lib/astro/collections/type-guards";
import type { QueryMode } from "../../types/data";
import type { AvailableLanguage } from "../../utils/i18n";
import { updateEntryTagsForLocale } from "./utils";

type QueryEntryOptions<
  C extends CollectionKey,
  F extends QueryMode = "full",
> = {
  collection: C;
  format?: F;
  id: CollectionEntry<C>["id"];
  locale?: AvailableLanguage | undefined;
};

/**
 * Query a single entry in any collection.
 *
 * @template C - The collection key.
 * @template F - The entry format.
 * @param {QueryEntryOptions<C, F>} options - The options to query the entry.
 * @returns {Promise<ReturnType<FormatEntryReturnMap<F>[C]>>} The formatted entry.
 * @throws When the entry is not found.
 */
export const queryEntry = async <
  C extends CollectionKey,
  F extends QueryMode = "full",
>({
  collection,
  format,
  id,
  locale,
}: QueryEntryOptions<C, F>): Promise<
  ReturnType<FormatEntryReturnMap<F>[C]>
> => {
  const fullId = locale ? `${locale}/${id}` : id;
  const { byId } = await getEntriesIndex();
  const queriedEntry = byId.get(fullId);

  if (queriedEntry === undefined) {
    throw new Error(
      `Couldn't find an entry in ${collection} for the given id: ${id}.`
    );
  }

  if (!isInCollection(queriedEntry, collection)) {
    throw new Error(
      `Found an entry for ${id} but it wasn't in ${collection}, received: ${queriedEntry.raw.collection}.`
    );
  }

  const updatedEntry = locale
    ? updateEntryTagsForLocale(queriedEntry, locale)
    : queriedEntry;

  return formatEntry<C, F>(updatedEntry, { format, indexById: byId });
};
