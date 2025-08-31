import { basename, join, parse } from "node:path";
import { getCumulativePaths, splitPath } from "../../../../utils/paths";
import { capitalizeFirstLetter } from "../../../../utils/strings";
import type { Stories, StoriesIndex, Story } from "./types/internal";

/**
 * Remove the `.stories` suffix from the given string.
 *
 * @param {string} str - The string to sanitize.
 * @returns {string} The string without the stories suffix.
 *
 * @example
 * ```
 * const str = "components/buttons/button.stories";
 * const result = stripStoriesSuffix(str);
 * console.log(result); // "components/buttons/button";
 * ```
 */
const stripStoriesSuffix = (str: string): string =>
  str.replace(/\.stories$/, "");

/**
 * Capitalize each part of a story filename.
 *
 * @param {string} filename - A filename to capitalize.
 * @returns {string} The capitalized name.
 *
 * @example
 * ```
 * const str = "some-component";
 * const result = capitalizeStoryFilename(str);
 * console.log(result); // "Some Component";
 * ```
 */
const capitalizeStoryFilename = (filename: string): string =>
  filename
    .split("-")
    .map((substr) => capitalizeFirstLetter(substr))
    .join(" ");

/**
 * Remove the last directory named "stories".
 *
 * This is useful when a component contains multiple stories in a separate
 * directory because we don't want `stories` to appear in the route. Stories in
 * `src/stories` should also be considered as top-level and the directory name
 * should be stripped.
 *
 * @param {string[]} pathParts - A splitted path.
 * @returns {string[]} The parts without the last stories dir.
 *
 * @example
 * ```
 * const parts = ["components", "buttons", "stories", "first-story"];
 * const result = removeLastStoriesDir(parts);
 * console.log(result); // ["components", "buttons", "first-story"];
 * ```
 */
const removeLastStoriesDir = (pathParts: string[]): string[] => {
  const dirIdx = pathParts.lastIndexOf("stories");
  if (dirIdx === -1) return pathParts;
  return [...pathParts.slice(0, dirIdx), ...pathParts.slice(dirIdx + 1)];
};

/**
 * Deduplicate the last segment of a path.
 *
 * @param {string[]} pathParts - A splitted path.
 * @returns {string[]} The parts with the last segment deduplicated.
 *
 * @example
 * ```
 * const parts = ["components", "button", "button"];
 * const result = deduplicateLastSegment(parts);
 * console.log(result); // ["components", "button"];
 * ```
 */
const deduplicateLastSegment = (pathParts: string[]): string[] => {
  const lastSegment = pathParts.at(-1);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Explicit enough.
  const secondToLastSegment = pathParts.at(-2);

  return lastSegment === secondToLastSegment
    ? pathParts.slice(0, -1)
    : pathParts;
};

const cleanDirectoryPath = (dir: string): string => {
  const parts = splitPath(dir);
  const withoutLastStoriesDir = removeLastStoriesDir(parts);
  return withoutLastStoriesDir.join("/");
};

type ParsePathConfig = Pick<GetStoriesConfig, "base" | "src"> & {
  /** The path to parse. */
  path: string;
};

type StoryPathInfo = {
  ancestors: string[];
  ext: string;
  filename: string;
  label: string;
  path: string;
  route: string;
  slug: string;
};

const parseStoryPath = ({
  base,
  path,
  src,
}: ParsePathConfig): StoryPathInfo => {
  const { dir, ext, name } = parse(path);
  const filename = stripStoriesSuffix(name);
  const label = capitalizeStoryFilename(filename);
  const cleanDir = cleanDirectoryPath(dir);
  const parts = [...splitPath(cleanDir), filename];
  const deduplicatedParts = deduplicateLastSegment(parts);
  const slug = deduplicatedParts.join("/");
  const route = `${base}/${slug}`;

  return {
    ancestors: [base, ...getCumulativePaths(cleanDir)],
    ext,
    filename,
    label,
    path: join(src, path),
    route,
    slug,
  };
};

type IndexPathInfo = {
  dirname: string;
  label: string;
  path: string;
  route: string;
  slug: string;
};

const parseIndexPath = ({
  base,
  path,
  src,
}: ParsePathConfig): IndexPathInfo => {
  const dirname = basename(path);
  const route = path === base ? path : `${base}${path}`;

  return {
    dirname,
    label: capitalizeStoryFilename(dirname),
    path: join(src, path),
    slug: path.slice(1),
    route,
  };
};

const formatStory = ({
  ancestors,
  filename,
  slug,
  ...story
}: StoryPathInfo): Story => {
  return {
    type: "story",
    ...story,
  };
};

const formatIndex = (
  { label, route, slug }: IndexPathInfo,
  stories: StoryPathInfo[]
): StoriesIndex => {
  const children = stories
    .filter((story) => story.ancestors.includes(`/${slug}`))
    .map((story) => {
      return { label: story.label, route: story.route };
    });

  return {
    type: "index",
    children,
    label,
    route,
  };
};

const formatStories = (
  stories: StoryPathInfo[],
  indexes: IndexPathInfo[]
): Stories => {
  const formattedStories = stories.map(
    (story) => [story.slug, formatStory(story)] as const
  );
  const formattedIndexes = indexes.map(
    (idx) => [idx.slug, formatIndex(idx, stories)] as const
  );

  return Object.fromEntries([...formattedIndexes, ...formattedStories]);
};

type GetStoriesConfig = {
  /** The base route where to inject the routes. */
  base: string;
  /** The stories paths. */
  paths: string[];
  /** An absolute path to the source directory. */
  src: string;
};

/**
 * Retrieve all the stories routes and their indexes.
 *
 * @param {GetStoriesConfig} config - A configuration object.
 * @returns {Stories} An object mapping a slug to either a story or an index.
 */
export const getStories = ({ base, paths, src }: GetStoriesConfig): Stories => {
  const stories = paths.map((path) => parseStoryPath({ base, path, src }));
  const uniqueIndexes = new Set(stories.flatMap((story) => story.ancestors));
  const indexes = [...uniqueIndexes.values(), base].map((path) =>
    parseIndexPath({ base, path, src })
  );

  return formatStories(stories, indexes);
};
