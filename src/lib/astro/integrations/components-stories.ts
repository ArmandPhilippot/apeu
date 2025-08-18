import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { globbySync } from "globby";
import slash from "slash";
import { STORIES_EXT } from "../../../utils/constants";
import { joinPaths } from "../../../utils/paths";
import { getStoryRoute } from "../../../utils/stories";

/**
 * Retrieve a message displaying the number of routes found and eventually a
 * list of those routes.
 *
 * @param {string[]} routes - A list of stories routes.
 * @param {boolean} includeList - Should we include the routes list?
 * @returns {string} The info about the routes.
 */
const getComponentStoriesResultMsg = (
  routes: string[],
  includeList: boolean
): string => {
  const storyOrStories = routes.length === 1 ? "story" : "stories";
  const message = `Found ${routes.length} ${storyOrStories}.`;

  if (!includeList || routes.length === 0) return message;

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
 * @returns {AstroIntegration} The Astro integration.
 */
export const componentsStories = (({
  baseSlug,
  components,
  logStories = false,
}: ComponentsStoriesConfig) => {
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
          const prefixedRoute =
            baseSlug === undefined ? route : joinPaths(baseSlug, route);

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
}) satisfies (config: ComponentsStoriesConfig) => AstroIntegration;
