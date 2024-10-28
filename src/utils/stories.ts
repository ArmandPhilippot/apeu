import { STORIES_EXT, STORIES_SUFFIX } from "./constants";
import { getParentDirPath, joinPaths } from "./paths";
import { capitalizeFirstLetter } from "./strings";

const isSubStory = (path: string) => {
  return path.endsWith(`/${STORIES_SUFFIX}`);
};

const getSubStoryRoute = (path: string, baseSlug: string) => {
  const slug = path
    .replace(baseSlug, "")
    .replace(new RegExp(`.${STORIES_EXT}$`), "");
  const parent = getParentDirPath(baseSlug);

  return slug === "/index" ? parent : joinPaths(parent, slug);
};

/**
 * Retrieve the story route.
 *
 * Stories should live alongside components in a directory named after the
 * component name so to avoid route like `foo/bar/button/button` and instead
 * use `foo/bar/button` we need to truncate the path. The same applies for
 * stories located in a subdirectory.
 *
 * @param {string} path - The story path.
 * @returns {string} The story route.
 */
export const getStoryRoute = (path: string): string => {
  const route = getParentDirPath(path);

  return isSubStory(route) ? getSubStoryRoute(path, route) : route;
};

export const getStoryNameFromSlug = (slug: string) => {
  const name = slug.split("/").pop();

  if (!name)
    throw new Error(
      "Could not retrieve the story name from its slug. Are you sure this slug match a story?",
    );

  return name
    .split("-")
    .map((name) => capitalizeFirstLetter(name))
    .join("");
};
