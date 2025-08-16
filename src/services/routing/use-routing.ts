import { getEntriesIndex } from "../../lib/astro/collections/indexes";

export type RouteById = (id: string) => string;

type UseRouting = () => Promise<{
  /**
   * A method to retrieve a localized route for a given id.
   */
  routeById: RouteById;
}>;

/**
 * Init routing functions.
 *
 * @returns {ReturnType<UseRouting>} An object containing the routing functions.
 */
export const useRouting: UseRouting = async (): ReturnType<UseRouting> => {
  const { byId } = await getEntriesIndex();

  const routeById: RouteById = (id: string) => {
    const match = byId.get(id);

    if (match === undefined || !("route" in match)) {
      throw new Error(`Cannot find a route for the given id, received: ${id}`);
    }

    return match.route;
  };

  return { routeById };
};
