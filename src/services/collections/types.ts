import type { CollectionKey } from "astro:content";
import type { FormatEntryReturnMap } from "../../lib/astro/collections/formatters";
import type { QueryMode } from "../../types/data";

export type PreviewableCollectionKey = Exclude<CollectionKey, "authors">;

export type PreviewableEntry<
  T extends PreviewableCollectionKey = PreviewableCollectionKey,
> = QueriedEntry<T, "preview">;

export type QueriedEntry<
  C extends CollectionKey,
  F extends QueryMode = "full",
> = Awaited<ReturnType<FormatEntryReturnMap<F>[C]>>;
