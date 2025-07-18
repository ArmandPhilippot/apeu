import type { Crumb, RouteIndexItem } from "../types/data";
import { getCumulativePaths, isLocalizedRoute, normalizeRoute } from "./routes";

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
  routeIndex: Map<string, RouteIndexItem>
): Crumb[] => {
  const segments = getRouteHierarchy(route);

  return segments
    .map((segment) => routeIndex.get(segment))
    .filter((entry) => entry !== undefined)
    .map((entry) => {
      return { label: entry.title, url: entry.route };
    });
};

type BreadcrumbConfig = {
  paginationLabel?: string | undefined;
  route: string;
  routeIndex: Map<string, RouteIndexItem>;
};

/**
 * Retrieve the breadcrumb for the given page.
 *
 * @param {BreadcrumbConfig} config - A configuration object.
 * @returns {Crumb[]} - The breadcrumb parts.
 */
export const getBreadcrumb = ({
  paginationLabel,
  route,
  routeIndex,
}: BreadcrumbConfig): Crumb[] => {
  const normalizedRoute = normalizeRoute(route);
  const crumbs = getRouteCrumbs(normalizedRoute, routeIndex);

  if (paginationLabel !== undefined) {
    crumbs.push({
      label: paginationLabel,
      url: route,
    });
  }

  return crumbs;
};
