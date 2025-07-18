import type { CollectionKey } from "astro:content";
import { collections } from "../../content.config";
import type { RouteIndexItem } from "../../types/data";
import { queryCollection } from "./collections";

const collectionEntriesWithoutRoutes = [
  "authors",
  "blogroll",
  "bookmarks",
] as const satisfies CollectionKey[];

/**
 * Build a Map of all the available routes using routes as key and matching entries as value.
 *
 * @returns {Promise<Map<string, RouteIndexItem>>} A Map of available routes.
 */
const buildRouteIndex = async (): Promise<Map<string, RouteIndexItem>> => {
  const collectionWithRoutes = Object.keys(collections).filter(
    (key) => !(collectionEntriesWithoutRoutes as string[]).includes(key)
  ) as Exclude<
    keyof typeof collections,
    (typeof collectionEntriesWithoutRoutes)[number]
  >[];
  const entriesWithRoutes = await Promise.all(
    collectionWithRoutes.map(async (collection) => {
      const { entries } = await queryCollection(collection);
      return entries;
    })
  );
  const map = new Map<string, RouteIndexItem>();

  for (const entry of entriesWithRoutes.flat()) {
    map.set(entry.route, {
      route: entry.route,
      id: entry.id,
      locale: entry.locale,
      title: entry.title,
    });
  }

  return map;
};

let cachedIndex: Map<string, RouteIndexItem> | null = null;

/**
 * Retrieve a Map of indexed routes.
 *
 * @returns {Promise<Map<string, RouteIndexItem>>} The indexed routes.
 */
export const getRouteIndex = async (): Promise<Map<string, RouteIndexItem>> => {
  if (cachedIndex === null) {
    const freshIndex = await buildRouteIndex();
    cachedIndex ??= freshIndex;
  }

  return cachedIndex;
};
