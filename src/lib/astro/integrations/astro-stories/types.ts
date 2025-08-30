import type { MarkdownHeading } from "astro";

export type Story = {
  ext: string;
  pathWithoutExt: string;
  route: string;
  type: "story";
};

export type StoryIndex = {
  children: string[];
  route: string;
  type: "index";
};

export type Stories = Record<string, Story | StoryIndex>;

type Frontmatter = Record<string, unknown>;

export type StoryFrontmatter<T extends Frontmatter> = T;

export type StoryEntry<T extends Frontmatter> = Pick<
  Story,
  "route" | "type"
> & {
  frontmatter: StoryFrontmatter<T>;
  headings: MarkdownHeading[];
};
export type StoryIndexEntry = Pick<StoryIndex, "route" | "type">;

export type StoryLayoutProps<T extends Frontmatter = Frontmatter> = {
  story: StoryEntry<T> | StoryIndexEntry;
};
