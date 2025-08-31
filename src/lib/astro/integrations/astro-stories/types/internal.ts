import type { Crumb } from "../../../../../types/data";

export type Story = {
  breadcrumb: Crumb[];
  ext: string;
  path: string;
  route: string;
  label: string;
  type: "story";
};

export type StoriesIndex = {
  breadcrumb: Crumb[];
  children: { route: string; label: string }[];
  route: string;
  label: string;
  type: "index";
};

export type Stories = Record<string, Story | StoriesIndex>;
