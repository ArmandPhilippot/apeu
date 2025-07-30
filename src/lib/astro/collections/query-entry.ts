import {
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import type { AvailableLanguage } from "../../../utils/i18n";
import type { QueryMode } from "../../../types/data";
import { formatEntry, type FormatEntryReturnMap } from "./format-entry";

type QueryEntryOptions<C extends CollectionKey, F extends QueryMode> = {
  collection: C;
  format?: F;
  id: CollectionEntry<C>["id"];
  locale?: AvailableLanguage | undefined;
};

/**
 * Query a single entry in any collection.
 *
 * @template C, F
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
  const entry = await getEntry(collection, fullId);

  if (entry === undefined) {
    throw new Error(
      `Couldn't find an entry in ${collection} for the given id: ${id}.`
    );
  }

  return formatEntry<C, F>(entry, format);
};;
