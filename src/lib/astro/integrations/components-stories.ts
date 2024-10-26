import type { AstroIntegration } from "astro";
import { globbySync } from "globby";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import slash from "slash";
import { STORIES_EXT, STORIES_SUFFIX } from "../../../utils/constants";
import { getParentDirPath, joinPaths } from "../../../utils/paths";

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
const getStoryRoute = (path: string): string => {
  const route = getParentDirPath(path);

  return isSubStory(route) ? getSubStoryRoute(path, route) : route;
};

/**
 * Retrieve a message displaying the number of routes found and eventually a
 * list of those routes.
 *
 * @param {string[]} routes - The routes
 * @param {boolean} includeList - Should we include the routes list?
 * @returns {string} The info about the routes.
 */
const getComponentStoriesResultMsg = (
  routes: string[],
  includeList: boolean,
): string => {
  const storyOrStories = routes.length === 1 ? "story" : "stories";
  const message = `Found ${routes.length} ${storyOrStories}.`;

  if (!includeList || !routes.length) return message;

  return message.replace(".", `:\n${routes.join("\n")}`);
};

type ComponentsStoriesConfig = {
  /**
   * A relative path from your project root pointing to the components
   * directory. Your stories should live alongside your components so this is
   * required to retrieve them.
   *
   * @example `./src/components`
   */
  components: string;
  /**
   * Should we log the stories list in the console? This can be useful to
   * check that all went well.
   *
   * @default false
   */
  logStories?: boolean | undefined;
  /**
   * Use this if you want the stories to be served under a parent path.
   *
   * @example `/design-system`
   */
  baseSlug?: string;
};

/**
 * Astro integration to enable component stories.
 *
 * This integration only supports `.stories.astro` files for your stories. They
 * should live alongside your components.
 *
 * @param {ComponentsStoriesConfig} config - A configuration object.
 * @returns {AstroIntegration}
 */
export const componentsStories = ({
  baseSlug,
  components,
  logStories = false,
}: ComponentsStoriesConfig): AstroIntegration => {
  return {
    name: "components-stories",
    hooks: {
      "astro:config:setup": ({ command, config, injectRoute, logger }) => {
        if (command !== "dev") return;

        const componentsDir = new URL(components, config.root);
        const pattern = `**/*.${STORIES_EXT}`;
        const stories = globbySync(pattern, {
          cwd: componentsDir,
        });

        const routes = stories.map((storyPath) => {
          const route = getStoryRoute(storyPath);
          const prefixedRoute = baseSlug ? joinPaths(baseSlug, route) : route;

          injectRoute({
            entrypoint: slash(join(fileURLToPath(componentsDir), storyPath)),
            pattern: prefixedRoute,
          });

          /* We append `- ` before the route to avoid looping again over the
           * routes when displaying the routes list. */
          return `- ${prefixedRoute}`;
        });

        logger.info(getComponentStoriesResultMsg(routes, logStories));
      },
    },
  };
};
