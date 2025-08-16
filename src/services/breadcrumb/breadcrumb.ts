import {
  getEntriesIndex,
  type EntryByRouteIndex,
} from "../../lib/astro/collections/indexes";
import type { Crumb } from "../../types/data";
import {
  getCumulativePaths,
  isLocalizedRoute,
  normalizeRoute,
} from "../../utils/routes";

/**
 * Breaks a route into cumulative path steps.
 *
 * @example "/en/blog/posts" → ["/en", "/en/blog", "/en/blog/posts"]
 * @param {string} route - A route to parse.
 * @returns {string[]} An array of cumulative path steps.
 */
const getRouteHierarchy = (route: string): string[] => {
  if (route === "/") return ["/"];

  const steps = getCumulativePaths(route);
  return isLocalizedRoute(route) ? steps : ["/", ...steps];
};

const getRouteCrumbs = (
  route: string,
  routeIndex: EntryByRouteIndex
): Crumb[] => {
  const segments = getRouteHierarchy(route);

  return segments
    .map((segment) => routeIndex.get(segment))
    .filter((entry) => entry !== undefined)
    .map((entry) => {
      return { label: entry.raw.data.title, url: entry.route };
    });
};

type BreadcrumbConfig = {
  paginationLabel?: string | undefined;
  route: string;
};

/**
 * Retrieve the breadcrumb for the given page.
 *
 * @param {BreadcrumbConfig} config - A configuration object.
 * @returns {Promise<Crumb[]>} - The breadcrumb parts.
 */
export const getBreadcrumb = async ({
  paginationLabel,
  route,
}: BreadcrumbConfig): Promise<Crumb[]> => {
  const { byRoute } = await getEntriesIndex();
  const normalizedRoute = normalizeRoute(route);
  const crumbs = getRouteCrumbs(normalizedRoute, byRoute);

  if (paginationLabel !== undefined) {
    crumbs.push({
      label: paginationLabel,
      url: route,
    });
  }

  return crumbs;
};
