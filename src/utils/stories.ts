import type { Route, SEO } from "../types/data";

/**
 * Derive the `<title>` string for SEO purposes from a breadcrumb trail.
 *
 * @param {Route[]} breadcrumb - The breadcrumb trail for the page.
 * @returns {string} A human-readable SEO title string.
 */
const getStorySeoTitle = (breadcrumb: Route[]): string =>
  breadcrumb
    .slice(1)
    .toReversed()
    .map((crumb) => crumb.label)
    .join(" | ");

type GetStorySeoConfig = {
  breadcrumb: Route[];
  seo?: Partial<SEO> | undefined | null;
};

/**
 * Compute SEO metadata for a story by deriving the SEO title from the
 * breadcrumb with some overridable data.
 *
 * @param {GetStorySeoConfig} config - A configuration object.
 * @returns {SEO} An SEO object.
 */
export const getStorySeo = ({ breadcrumb, seo }: GetStorySeoConfig): SEO => {
  return {
    ...seo,
    noindex: seo?.noindex ?? true,
    nofollow: seo?.nofollow ?? true,
    title: seo?.title ?? getStorySeoTitle(breadcrumb),
  };
};
