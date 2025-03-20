import type { ListItem } from "schema-dts";

type ListItemGraphData = {
  id: string;
  label: string;
  position: number;
};

/**
 * Retrieve a ListItem graph from the given data.
 *
 * @param {ListItemGraphData} data - An object containing the item data.
 * @returns {ListItem} A graph describing a list item.
 */
export const getListItemGraph = ({
  id,
  label,
  position,
}: ListItemGraphData): ListItem => {
  return {
    "@type": "ListItem",
    item: {
      "@id": id,
      name: label,
    },
    position,
  };
};
