import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { globbySync } from "globby";
import slash from "slash";
import { joinPaths } from "../../../utils/paths";

/**
 * Check if the given prefix is valid.
 *
 * Astro has a built-in feature to exclude some pages from being built. So we
 * should take advantage of that for our dev-only pages. However we need a
 * different prefix to ignore non-route files (ie. A component living in pages
 * directory) so the prefix should be at least two characters long..
 *
 * @see https://docs.astro.build/en/guides/routing/#excluding-pages
 *
 * @param {string} prefix - The prefix to check.
 * @returns {boolean} True if valid.
 */
const isValidPrefix = (prefix: string): boolean =>
  prefix.startsWith("_") && prefix.length > 1;

const INVALID_PREFIX_ERROR =
  "The dev-only pages prefix must start with an underscore (`_`) and its length must be equal to or greater than 2.";

const removeAstroExt = (path: string) => path.replace(/\.astro$/, "");

const removeTrailingIndex = (route: string) => route.replace(/\/index$/, "");

/**
 * Retrieve the route of a dev-only page from its path and prefix.
 *
 * @param {string} path - The path of a dev-only page.
 * @param {string} prefix - The prefix used for dev-only pages.
 * @returns {string} The computed route for the dev-only page.
 */
const getDevOnlyPageRoute = (path: string, prefix: string): string => {
  const pathWithoutExt = removeAstroExt(path);
  const firstPrefixIndex = pathWithoutExt.indexOf(prefix);
  const parentRoute = pathWithoutExt.slice(0, firstPrefixIndex);
  const remainingRoute = pathWithoutExt.slice(firstPrefixIndex + prefix.length);
  /* When the file is name `index.astro`, the route should be accessible
   * without `index` in the slug. */
  const fileRoute = removeTrailingIndex(remainingRoute);

  return joinPaths(parentRoute, fileRoute).replace(/^\/?/, "/");
};

/**
 * Retrieve a message displaying the number of routes found and eventually a
 * list of those routes.
 *
 * @param {string[]} routes - A list of dev-only pages routes.
 * @param {boolean} includeList - Should we include the routes list?
 * @returns {string} The info about the routes.
 */
const getDevOnlyPagesResultMsg = (
  routes: string[],
  includeList: boolean
): string => {
  const message = `Found ${routes.length} dev-only ${
    routes.length === 1 ? "route" : "routes"
  }.`;

  if (!includeList || routes.length === 0) return message;

  return message.replace(".", `:\n${routes.join("\n")}`);
};

type DevOnlyPagesConfig = {
  /**
   * Should we log the dev-only pages list in the console? This can be useful to
   * check the slugs to use to access them.
   *
   * @default false
   */
  logPages?: boolean | undefined;
  /**
   * The prefix used for you dev-only pages. This should start with `_` and
   * be at least two characters long.
   */
  prefix: string;
};

/**
 * Astro integration to enable dev-only pages.
 *
 * This integration only supports `.astro` pages.
 *
 * @param {DevOnlyPagesConfig} config - A configuration object.
 * @returns {AstroIntegration} The Astro integration.
 */
export const devOnlyPages = (({
  logPages = false,
  prefix,
}: DevOnlyPagesConfig) => {
  const devOnlyPagesPatterns = [
    `**/${prefix}*.astro`,
    `**/${prefix}*/**/*.astro`,
    `!**/${prefix}*/**/_*.astro`,
  ];

  return {
    name: "dev-only-pages",
    hooks: {
      "astro:config:setup": ({ command, config, injectRoute, logger }) => {
        if (command !== "dev") return;

        if (!isValidPrefix(prefix)) {
          logger.error(INVALID_PREFIX_ERROR);
          return;
        }

        const pagesDir = new URL("./src/pages", config.root);
        const pages = globbySync(devOnlyPagesPatterns, {
          cwd: pagesDir,
        });
        const devOnlyRoutes = pages.map((page) => {
          const route = getDevOnlyPageRoute(page, prefix);

          injectRoute({
            entrypoint: slash(join(fileURLToPath(pagesDir), page)),
            pattern: route,
          });

          /* We append `- ` before the route to avoid looping again over the
           * routes when displaying the routes list. */
          return `- ${route}`;
        });

        logger.info(getDevOnlyPagesResultMsg(devOnlyRoutes, logPages));
      },
    },
  };
}) satisfies (config: DevOnlyPagesConfig) => AstroIntegration;
