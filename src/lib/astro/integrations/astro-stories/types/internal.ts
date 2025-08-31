export type Story = {
  ext: string;
  path: string;
  route: string;
  label: string;
  type: "story";
};

export type StoriesIndex = {
  children: { route: string; label: string }[];
  route: string;
  label: string;
  type: "index";
};

export type Stories = Record<string, Story | StoriesIndex>;
