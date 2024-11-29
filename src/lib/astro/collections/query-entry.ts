import {
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import type { AvailableLanguage } from "../../../utils/i18n";
import { formatEntry, type EntryFormat } from "./format-entry";

type QueryEntryOptions<C extends CollectionKey, F extends EntryFormat> = {
  collection: C;
  format?: F;
  id: CollectionEntry<C>["id"];
  locale?: AvailableLanguage | undefined;
};

export const queryEntry = async <
  C extends CollectionKey,
  F extends EntryFormat = "full",
>({
  collection,
  format,
  id,
  locale,
}: QueryEntryOptions<C, F>) => {
  const fullId = locale ? `${locale}/${id}` : id;
  const entry = await getEntry(collection, fullId);

  if (!entry)
    throw new Error(
      `Couldn't find an entry in ${collection} for the given id: ${id}.`,
    );

  return formatEntry<C, F>(entry, format);
};
