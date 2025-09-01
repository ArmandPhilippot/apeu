import type { Crumb } from "../../../../../types/data";

export type Story = {
  breadcrumb: Crumb[];
  label: string;
  path: string;
  route: string;
  slug: string;
  type: "story";
  virtualModuleId: string;
};

export type StoriesIndex = {
  breadcrumb: Crumb[];
  children: { route: string; label: string }[];
  label: string;
  route: string;
  type: "index";
};

export type Stories = Record<string, Story | StoriesIndex>;
