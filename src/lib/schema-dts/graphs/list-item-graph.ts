import type { ListItem } from "schema-dts";

type ListItemGraphData = {
  id: string;
  label: string;
  position: number;
};

export const getListItemGraph = ({
  id,
  label,
  position,
}: ListItemGraphData): ListItem => {
  return {
    "@type": "ListItem",
    "@id": id,
    name: label,
    position,
  };
};
