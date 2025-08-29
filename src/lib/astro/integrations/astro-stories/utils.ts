import { join, parse, relative, sep } from "node:path";
import { globSync } from "tinyglobby";
import { splitPath } from "../../../../utils/paths";
import { removeTrailingSlashes } from "../../../../utils/strings";
import type { Stories, Story, StoryIndex } from "./types";

const stripStoriesSuffix = (parts: string[]): string[] => {
  const last = parts.at(-1);
  if (last?.endsWith(".stories") === true) {
    return [...parts.slice(0, -1), last.replace(/\.stories$/, "")];
  }
  return parts;
};

const removeLastStoriesDir = (parts: string[]): string[] => {
  const idx = parts.lastIndexOf("stories");
  if (idx !== -1) {
    return [...parts.slice(0, idx), ...parts.slice(idx + 1)];
  }
  return parts;
};

const deduplicateLastSegment = (pathParts: string[]): string[] => {
  const lastSegment = pathParts.at(-1);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Explicit enough.
  const secondToLastSegment = pathParts.at(-2);

  return lastSegment === secondToLastSegment
    ? pathParts.slice(0, -1)
    : pathParts;
};

const buildSlug = (path: string): string => {
  let result = [...splitPath(path)];
  result = stripStoriesSuffix(result);
  result = removeLastStoriesDir(result);
  result = deduplicateLastSegment(result);
  return result.join("/");
};

type StoryPathInfo = {
  ext: string;
  pathWithoutExt: string;
  slug: string;
  route: string;
};

type GetPathInfoConfig = {
  base: string;
  relativePath: string;
  src: string;
};

const getPathInfo = ({
  base,
  relativePath,
  src,
}: GetPathInfoConfig): StoryPathInfo => {
  const { dir, ext, name } = parse(relativePath);
  const withoutExt = `${dir}${sep}${name}`;
  const pathWithoutExt = join(src, withoutExt);
  const slug = buildSlug(withoutExt);
  const route = removeTrailingSlashes(`${base}/${slug}`);

  return {
    ext,
    pathWithoutExt,
    slug,
    route,
  };
};

const getStory = ({
  ext,
  pathWithoutExt,
  route,
}: Pick<Story, "ext" | "pathWithoutExt" | "route">): Story => {
  return {
    ext,
    pathWithoutExt,
    route,
    type: "story",
  };
};

const isDirectChild = (parentPath: string, childPath: string): boolean => {
  const parentSlug = parentPath.slice(1);
  const childSlug = childPath.slice(1);

  if (!childSlug.startsWith(`${parentSlug}/`)) return false;

  const remainder = childSlug.slice(Math.max(0, parentSlug.length + 1));
  return !remainder.includes("/");
};

type GetStoryIndexConfig = {
  allPaths: string[];
  base: string;
  currentPath: string;
  route: string;
  src: string;
};

const getStoryIndex = ({
  allPaths,
  base,
  currentPath,
  route,
  src,
}: GetStoryIndexConfig): StoryIndex => {
  const children = allPaths
    .filter((childPath) => isDirectChild(currentPath, childPath))
    .map((childPath) => {
      const { route: childRoute } = getPathInfo({
        base,
        relativePath: relative(src, `./${childPath}`),
        src,
      });
      return childRoute;
    });

  return {
    children,
    route,
    type: "index",
  };
};

const getCumulativePaths = (path: string): string[] => {
  const parts = splitPath(path);
  const steps: string[] = [];

  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    steps.push(current);
  }

  return steps;
};

type BuildRoutesConfig = {
  base: string;
  src: string;
  stories: string[];
};

const buildRoutes = ({ base, src, stories }: BuildRoutesConfig): Stories => {
  const cumulativePaths = new Set(stories.flatMap(getCumulativePaths));
  const allPaths = [...cumulativePaths.values()];
  const routes = allPaths.map((path) => {
    const isStory = stories.includes(path.slice(1));
    const { ext, pathWithoutExt, slug, route } = getPathInfo({
      base,
      relativePath: relative(src, `./${path}`),
      src,
    });

    return [
      slug,
      isStory
        ? getStory({ ext, pathWithoutExt, route })
        : getStoryIndex({ allPaths, base, currentPath: path, route, src }),
    ] as const;
  });

  return Object.fromEntries(routes);
};

type StoriesConfig = {
  base: string;
  patterns: string[];
  root: string;
  src: string;
};

/**
 * Retrieve all the stories routes and their indexes.
 *
 * @param {StoriesConfig} config - The config to fetch stories.
 * @returns {Stories} An object mapping a slug to either a story or an index.
 */
export const getStories = ({
  base,
  patterns,
  root,
  src,
}: StoriesConfig): Stories => {
  const fullPatterns = patterns.map((pattern) => join(src, `${pattern}.mdx`));
  const storiesPaths = globSync(fullPatterns, {
    cwd: root,
  });

  return buildRoutes({ base, src, stories: storiesPaths });
};
