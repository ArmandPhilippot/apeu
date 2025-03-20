import { STORIES_EXT, STORIES_SUFFIX } from "./constants";
import { getParentDirPath, joinPaths } from "./paths";
import { capitalizeFirstLetter } from "./strings";

const isSubStory = (path: string) => path.endsWith(`/${STORIES_SUFFIX}`);

const getSubStoryRoute = (path: string, baseSlug: string) => {
  const slug = path
    .replace(baseSlug, "")
    .replace(new RegExp(`.${STORIES_EXT}$`), "");
  const parentPath = getParentDirPath(baseSlug);

  return slug === "/index" ? parentPath : joinPaths(parentPath, slug);
};

/**
 * Retrieve the story route.
 *
 * Stories should live alongside components in a directory named after the
 * component name so to avoid route like `foo/bar/button/button` and instead
 * use `foo/bar/button` we need to truncate the path. The same applies for
 * stories located in a subdirectory.
 *
 * @param {string} path - The path to a story file.
 * @returns {string} The computed story route.
 */
export const getStoryRoute = (path: string): string => {
  const route = getParentDirPath(path);

  return isSubStory(route) ? getSubStoryRoute(path, route) : route;
};

/**
 * Retrieve a story name from its slug.
 *
 * @param {string} slug - The slug of a story.
 * @returns {string} The name of a story.
 * @throws {Error} When the story name can't be determined.
 */
export const getStoryNameFromSlug = (slug: string): string => {
  const storyName = slug.split("/").pop();

  if (storyName === "" || storyName === undefined) {
    throw new Error(
      "Could not retrieve the story name from its slug. Are you sure this slug match a story?"
    );
  }

  return storyName
    .split("-")
    .map((story) => capitalizeFirstLetter(story))
    .join("");
};
