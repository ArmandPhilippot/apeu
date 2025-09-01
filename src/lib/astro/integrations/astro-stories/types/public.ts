import type { MarkdownHeading } from "astro";
import type { StoriesIndex, Story } from "./internal";

export type AstroStoriesConfig = {
  /**
   * A base route where to inject the stories.
   */
  base: string;
  /**
   * The path of a layout to use for the stories.
   */
  layout?: string | null | undefined;
  /**
   * An array of patterns relative to your source directory.
   */
  patterns?: string[] | undefined;
};

export type Frontmatter = Record<string, unknown>;

/**
 * An entry matching an actual story.
 *
 * @template T - The frontmatter type.
 */
export type StoryEntry<T extends Frontmatter = Frontmatter> = Pick<
  Story,
  "breadcrumb" | "label" | "route" | "type"
> & {
  /** The frontmatter of the story. */
  frontmatter: T;
  /** A list of headings in the story. */
  headings: MarkdownHeading[];
};

/**
 * An entry matching an index for stories.
 */
export type StoriesIndexEntry = Pick<
  StoriesIndex,
  "breadcrumb" | "label" | "route" | "type"
>;

/**
 * The properties received by the layout.
 *
 * @template T - The frontmatter type used by stories.
 */
export type StoryLayoutProps<T extends Frontmatter = Frontmatter> = {
  story: StoryEntry<T> | StoriesIndexEntry;
};
