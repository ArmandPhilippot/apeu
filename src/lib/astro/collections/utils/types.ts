import type { CollectionEntry, CollectionKey } from "astro:content";
import type { Order } from "../../../../types/tokens";
import type { KeyOfType, LooseAutocomplete } from "../../../../types/utilities";
import type { AvailableLanguage } from "../../../../utils/i18n";

export type QueryCollectionOrderBy<C extends CollectionKey> = {
  /**
   * The key used to order the entries.
   */
  key: CollectionEntry<C>["data"] extends Record<"meta", unknown>
    ?
        | KeyOfType<CollectionEntry<C>["data"]["meta"], string | Date>
        | KeyOfType<CollectionEntry<C>["data"], string | Date>
    : KeyOfType<CollectionEntry<C>["data"], string | Date>;
  /**
   * The entries order.
   */
  order: Order;
};

export type QueryCollectionWhere = {
  /**
   * Retrieve only entries attached to the given authors.
   */
  authors: LooseAutocomplete<CollectionEntry<"authors">["id"]>[];
  /**
   * Retrieve only entries attached to the given blog categories.
   */
  categories: LooseAutocomplete<CollectionEntry<"blog.categories">["id"]>[];
  /**
   * Retrieve only entries with a matching id.
   */
  ids: string[];
  /**
   * Retrieve only entries in the given locale.
   */
  locale: LooseAutocomplete<AvailableLanguage>;
  /**
   * Retrieve only entries attached to the given tags.
   */
  tags: LooseAutocomplete<CollectionEntry<"tags">["id"]>[];
};
