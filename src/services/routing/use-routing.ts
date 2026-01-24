import { getEntriesIndex } from "../../lib/astro/collections/indexes";
import type { Route } from "../../types/data";
import type { AvailableLocale } from "../../types/tokens";

type UseRouting = (locale: AvailableLocale) => Promise<{
  /**
   * A method to retrieve a localized route for a given id.
   */
  routeById: (id: string, localeOverride?: AvailableLocale) => Route;
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

  return {
    routeById: (id, routeLocale = locale) => {
      const fullId = `${routeLocale}/${id}`;
      const match = byId.get(fullId);

      if (match === undefined || !("route" in match)) {
        throw new Error(
          `Cannot find a route for the given id using "${routeLocale}" as locale. Received: ${id}`
        );
      }

      return { label: match.raw.data.title, path: match.route };
    },
  };
};
