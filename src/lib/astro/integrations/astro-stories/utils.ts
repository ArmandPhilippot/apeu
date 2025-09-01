import { basename, join, parse } from "node:path";
import type { Crumb } from "../../../../types/data";
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
  /** A story or index path to parse. */
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
  virtualModuleId: string;
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
  const virtualModuleId = `virtual:astro-stories/stories/${slug.replaceAll(/[^\w/-]/g, "_")}`;

  return {
    ancestors: [base, ...getCumulativePaths(cleanDir)],
    ext,
    filename,
    label,
    path: join(src, path),
    route,
    slug,
    virtualModuleId,
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
  const dirName = basename(path);
  const route = path === base ? path : `${base}${path}`;

  return {
    dirname: dirName,
    label: capitalizeStoryFilename(dirName),
    path: join(src, path),
    slug: path.slice(1),
    route,
  };
};

type GenerateBreadcrumbConfig = {
  /** The route to generate breadcrumbs for. */
  route: string;
  /** Map of routes to their labels. */
  routeMap: Map<string, { label: string; route: string }>;
};

/**
 * Generate breadcrumb trail for a given route.
 *
 * @param {GenerateBreadcrumbConfig} config - The config to generate breadcrumbs.
 * @returns {Crumb[]} Array of breadcrumb items.
 */
const generateBreadcrumb = ({
  route,
  routeMap,
}: GenerateBreadcrumbConfig): Crumb[] => {
  const breadcrumb: Crumb[] = [{ url: "/", label: "Home" }];
  const pathParts = route.split("/").filter(Boolean);

  for (let i = 0; i < pathParts.length; i++) {
    const currentPath = `/${pathParts.slice(0, i + 1).join("/")}`;
    const routeInfo = routeMap.get(currentPath);

    if (routeInfo !== undefined) {
      breadcrumb.push({
        label: routeInfo.label,
        url: routeInfo.route,
      });
    }
  }

  return breadcrumb;
};

type FormatStoryConfig = {
  routeMap: Map<string, { label: string; route: string }>;
  story: StoryPathInfo;
};

const formatStory = ({ routeMap, story }: FormatStoryConfig): Story => {
  const { ancestors, filename, route, ...remainingData } = story;
  return {
    ...remainingData,
    breadcrumb: generateBreadcrumb({ route, routeMap }),
    route,
    type: "story",
  };
};

type FormatIndexConfig = {
  index: IndexPathInfo;
  stories: StoryPathInfo[];
  routeMap: Map<string, { label: string; route: string }>;
};

const formatIndex = ({
  index,
  routeMap,
  stories,
}: FormatIndexConfig): StoriesIndex => {
  const { label, route, slug } = index;
  const children = stories
    .filter((story) => story.ancestors.includes(`/${slug}`))
    .map((story) => {
      return { label: story.label, route: story.route };
    });

  return {
    type: "index",
    breadcrumb: generateBreadcrumb({ route, routeMap }),
    children,
    label,
    route,
  };
};

const formatStories = (
  stories: StoryPathInfo[],
  indexes: IndexPathInfo[]
): Stories => {
  const routeMap = new Map<string, { label: string; route: string }>();

  for (const index of indexes) {
    routeMap.set(index.route, {
      label: index.label,
      route: index.route,
    });
  }

  for (const story of stories) {
    routeMap.set(story.route, {
      label: story.label,
      route: story.route,
    });
  }

  const formattedStories = stories.map(
    (story) => [story.slug, formatStory({ routeMap, story })] as const
  );
  const formattedIndexes = indexes.map(
    (index) => [index.slug, formatIndex({ index, routeMap, stories })] as const
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
