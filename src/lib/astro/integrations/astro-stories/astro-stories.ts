import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { globSync } from "tinyglobby";
import { isString } from "../../../../utils/type-guards";
import type { Stories } from "./types/internal";
import type { AstroStoriesConfig } from "./types/public";
import { getStories } from "./utils";

const resolveVirtualModuleId = <T extends string>(id: T): `\0${T}` => `\0${id}`;

const createStoryModuleContent = (
  path: string
): string => `import * as mdx from ${JSON.stringify(path)};
export const frontmatter = mdx.frontmatter;
export const file = mdx.file;
export const url = mdx.url;
export const getHeadings = mdx.getHeadings;
export const Content = mdx.Content;
export const components = mdx.components;
export default mdx.default;`;

const createRegistryModules = (stories: Stories) => {
  const storyModulesMap: [string, string][] = [];
  const registryImports: string[] = [];
  const registryEntries: string[] = [];

  for (const [index, story] of Object.values(stories).entries()) {
    if (story.type === "index") continue;

    storyModulesMap.push([
      story.virtualModuleId,
      createStoryModuleContent(story.path),
    ]);
    registryImports.push(
      `import * as story${index} from ${JSON.stringify(story.virtualModuleId)};`
    );
    registryEntries.push(`  ${JSON.stringify(story.slug)}: story${index},`);
  }

  const storyRegistryModule = [
    ...registryImports,
    "",
    "export const storyRegistry = {",
    ...registryEntries,
    "};",
  ].join("\n");

  return {
    storyModules: Object.fromEntries(storyModulesMap),
    storyRegistryModule,
  };
};

const sanitizeBase = (base: string, logger: AstroIntegrationLogger) => {
  let sanitizedBase = base;

  if (!base.startsWith("/")) {
    sanitizedBase = `/${sanitizedBase}`;
    logger.warn(
      `The base option should start with a leading slash, received: ${base}. Please check the syntax in your config file.`
    );
  }

  if (base.endsWith("/")) {
    sanitizedBase = sanitizedBase.slice(0, -1);
    logger.warn(
      `The base option shouldn't end with a trailing slash, received: ${base}. Please check the syntax in your config file.`
    );
  }

  return sanitizedBase;
};

const DEFAULT_LAYOUT_PATH = fileURLToPath(
  new URL("./components/story-layout.astro", import.meta.url)
);

const filterSupportedPaths = (
  paths: string[],
  logger: AstroIntegrationLogger
) => {
  const mdxPaths = paths.filter((path) => path.endsWith(".mdx"));
  const nonMdxPaths = paths.filter((path) => !path.endsWith(".mdx"));

  if (nonMdxPaths.length > 0) {
    logger.warn(
      `Found ${nonMdxPaths.length} non-MDX files that will be ignored because unsupported. Received:\n${nonMdxPaths.join("\n")}\n\nPlease check your glob patterns.`
    );
  }

  return mdxPaths;
};

/**
 * An Astro integration to inject stories routes from MDX files based on
 * patterns.
 *
 * This integration supports `.stories.mdx` files anywhere or `.mdx` in a
 * `stories` directory. By default it looks everywhere in your source
 * directory, but you can configure patterns to constrain the lookup to
 * specific paths.
 *
 * @param {AstroStoriesConfig} config - A configuration object.
 * @returns {AstroIntegration} The Astro integration.
 */
export function astroStories({
  base,
  layout,
  patterns = ["**/*.stories.mdx", "**/stories/**/*.mdx"],
}: AstroStoriesConfig): AstroIntegration {
  const integrationName = "astro-stories";
  const virtualModuleIdPrefix = `virtual:${integrationName}`;

  return {
    name: integrationName,
    hooks: {
      "astro:config:setup"({
        command,
        config,
        injectRoute,
        logger,
        updateConfig,
      }) {
        if (command !== "dev") return;

        const sanitizedBase = sanitizeBase(base, logger);
        const layoutPath = isString(layout)
          ? resolve(fileURLToPath(config.root), layout)
          : DEFAULT_LAYOUT_PATH;
        const src = fileURLToPath(config.srcDir);
        const allPaths = globSync(patterns, { cwd: src });
        const mdxPaths = filterSupportedPaths(allPaths, logger);
        const stories = getStories({
          base: sanitizedBase,
          paths: mdxPaths,
          src,
        });
        const { storyModules, storyRegistryModule } =
          createRegistryModules(stories);

        injectRoute({
          pattern: `${sanitizedBase}/[...story]`,
          entrypoint: new URL("./[...story].astro", import.meta.url),
        });

        const modules = {
          [`${virtualModuleIdPrefix}/config` as const]: `export const base = ${JSON.stringify(sanitizedBase)}; export const stories = ${JSON.stringify(stories)}; export default ${JSON.stringify({ base: sanitizedBase, stories })};`,
          [`${virtualModuleIdPrefix}/Layout` as const]: `export { default } from ${JSON.stringify(layoutPath)};`,
          [`${virtualModuleIdPrefix}/registry` as const]: storyRegistryModule,
          ...storyModules,
        } satisfies Record<string, string>;

        /** Mapping names prefixed with `\0` to their original form. */
        const resolutionMap = Object.fromEntries(
          (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
            resolveVirtualModuleId(key),
            key,
          ])
        );

        updateConfig({
          vite: {
            plugins: [
              {
                name: `vite-plugin-${integrationName}`,
                resolveId(id) {
                  if (id in modules) return resolveVirtualModuleId(id);
                  return null;
                },
                load(id) {
                  const resolution = resolutionMap[id];
                  if (resolution === undefined) return null;
                  return modules[resolution];
                },
              },
            ],
          },
        });
      },
    },
  };
}
