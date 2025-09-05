import { getEntriesIndex } from "../../lib/astro/collections/indexes";
import type { Route } from "../../types/data";
import type { AvailableLocale } from "../../types/tokens";

export type RouteById = (id: string, locale?: AvailableLocale) => Route;

type UseRouting = (locale: AvailableLocale) => Promise<{
  /**
   * A method to retrieve a localized route for a given id.
   */
  routeById: RouteById;
}>;

/**
 * Init routing functions.
 *
 * @param {AvailableLocale} locale - The locale to use while fetching routes.
 * @returns {ReturnType<UseRouting>} An object containing the routing functions.
 */
export const useRouting: UseRouting = async (
  locale: AvailableLocale
): ReturnType<UseRouting> => {
  const { byId } = await getEntriesIndex();

  const routeById: RouteById = (id, routeLocale = locale) => {
    const fullId = `${routeLocale}/${id}`;
    const match = byId.get(fullId);

    if (match === undefined || !("route" in match)) {
      throw new Error(
        `Cannot find a route for the given id using "${routeLocale}" as locale. Received: ${id}`
      );
    }

    return { label: match.raw.data.title, url: match.route };
  };

  return { routeById };
};
