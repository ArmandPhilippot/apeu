import type { EntryPreview, EntryPreviewCTA } from "../../../../types/data";
import type { I18nContext } from "../../../i18n";

type CTAConfig = {
  i18n: Omit<I18nContext, "locale">;
  isExternal?: boolean | null | undefined;
  route: string;
  title: string;
};

/**
 * Retrieve a "Discover" CTA with proper aria label.
 *
 * @param {CTAConfig} config - A configuration object.
 * @returns {EntryPreviewCTA} A CTA object.
 */
export const getDiscoverCTA = ({
  i18n: { translate },
  isExternal,
  route,
  title,
}: CTAConfig): EntryPreviewCTA => {
  return {
    ariaLabel: translate("cta.discover.a11y", {
      title,
    }),
    isExternal,
    label: translate("cta.discover"),
    path: route,
  };
};

/**
 * Retrieve an "Open website" CTA with proper aria label.
 *
 * @param {string} url - The website url as string.
 * @param {Omit<I18nContext, "locale">} i18n - A partial i18n context.
 * @returns {EntryPreviewCTA} A CTA object.
 */
export const getOpenWebsiteCTA = (
  url: string,
  { translate }: Omit<I18nContext, "locale">
): EntryPreviewCTA => {
  return {
    ariaLabel: translate("cta.open.website.a11y"),
    icon: { name: "globe" },
    isExternal: true,
    label: translate("cta.open.website"),
    path: url,
  };
};

/**
 * Retrieve an "Open feed" CTA with proper aria label.
 *
 * @param {string} url - The feed url as string.
 * @param {Omit<I18nContext, "locale">} i18n - A partial i18n context.
 * @returns {EntryPreviewCTA} A CTA object.
 */
export const getOpenFeedCTA = (
  url: string,
  { translate }: Omit<I18nContext, "locale">
): EntryPreviewCTA => {
  return {
    ariaLabel: translate("cta.open.feed.a11y"),
    icon: { name: "feed" },
    isExternal: true,
    label: translate("cta.open.feed"),
    path: url,
  };
};

/**
 * Retrieve a "Read more" CTA with proper aria label.
 *
 * @param {CTAConfig} config - A configuration object.
 * @returns {EntryPreviewCTA} A CTA object.
 */
export const getReadMoreCTA = ({
  i18n: { translate },
  isExternal,
  route,
  title,
}: CTAConfig): EntryPreviewCTA => {
  return {
    ariaLabel: translate("cta.read.more.a11y", { title }),
    isExternal,
    label: translate("cta.read.more"),
    path: route,
  };
};

type PreviewActionConfig = {
  cta: EntryPreviewCTA[];
  heading: string;
  showCta: boolean | null | undefined;
  url: string;
};

/**
 * Retrieve the EntryPreview actions.
 *
 * @param {PreviewActionConfig} config - A configuration object.
 * @returns {Pick<EntryPreview, "cta" | "heading">} An object with a configured heading and cta.
 */
export const buildPreviewActions = ({
  cta,
  heading,
  url,
  showCta,
}: PreviewActionConfig): Pick<EntryPreview, "cta" | "heading"> => {
  if (showCta === true) return { cta, heading };

  return {
    cta: null,
    heading: { label: heading, path: url },
  };
};
