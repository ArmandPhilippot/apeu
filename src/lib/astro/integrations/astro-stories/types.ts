import type { MarkdownHeading } from "astro";

export type Story = {
  ext: string;
  pathWithoutExt: string;
  route: string;
  title: string;
  type: "story";
};

export type StoryIndex = {
  children: { route: string; title: string }[];
  route: string;
  title: string;
  type: "index";
};

export type Stories = Record<string, Story | StoryIndex>;

type Frontmatter = Record<string, unknown>;

export type StoryFrontmatter<T extends Frontmatter> = T;

export type StoryEntry<T extends Frontmatter> = Pick<
  Story,
  "route" | "title" | "type"
> & {
  frontmatter: StoryFrontmatter<T>;
  headings: MarkdownHeading[];
};
export type StoryIndexEntry = Pick<StoryIndex, "route" | "title" | "type">;

export type StoryLayoutProps<T extends Frontmatter = Frontmatter> = {
  story: StoryEntry<T> | StoryIndexEntry;
};
