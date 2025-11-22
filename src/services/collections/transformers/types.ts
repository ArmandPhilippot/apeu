import type { IconName } from "../../../types/tokens";
import type { AllKeysOf } from "../../../types/utilities";
import type { I18nContext } from "../../i18n";
import type { PreviewableCollectionKey, PreviewableEntry } from "../types";

type FeaturedMetaItem<
  T extends PreviewableCollectionKey = PreviewableCollectionKey,
> = {
  key: AllKeysOf<PreviewableEntry<T>["meta"]>;
  icon: IconName;
};

export type TransformEntryConfig<
  T extends PreviewableCollectionKey = PreviewableCollectionKey,
> = {
  featuredMetaItem?: FeaturedMetaItem<T> | null | undefined;
  i18n: Omit<I18nContext, "locale">;
  isQuote?: boolean | null | undefined;
  locale?: string | null | undefined;
  showAuthorsIfAvailable?: boolean | null | undefined;
  showCover?: boolean | null | undefined;
  showCta?: boolean | null | undefined;
  showMeta?: boolean | null | undefined;
};
