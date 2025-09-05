import type { BreadcrumbList } from "schema-dts";
import type { Route } from "../../../types/data";
import { getListItemGraph } from "./list-item-graph";

/**
 * Retrieve a BreadcrumbList graph from the given headings.
 *
 * @param {Route[]} breadcrumb - A list of heading objects.
 * @returns {BreadcrumbList} A graph describing the breadcrumb list.
 */
export const getBreadcrumbListGraph = (breadcrumb: Route[]): BreadcrumbList => {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((crumb, index) =>
      getListItemGraph({
        id: crumb.url,
        label: crumb.label,
        position: index + 1,
      })
    ),
  };
};
