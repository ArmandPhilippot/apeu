import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { isString } from "../../../../utils/type-guards";
import { getStories } from "./utils";

const resolveVirtualModuleId = <T extends string>(id: T): `\0${T}` => `\0${id}`;

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

type AstroStoriesConfig = {
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
  patterns = ["**/*"],
}: AstroStoriesConfig): AstroIntegration {
  const integrationName = "astro-stories";
  const virtualModuleIdPrefix = `virtual:${integrationName}`;

  return {
    name: integrationName,
    hooks: {
      "astro:config:setup"({ config, injectRoute, logger, updateConfig }) {
        const sanitizedBase = sanitizeBase(base, logger);
        const layoutPath = isString(layout)
          ? resolve(fileURLToPath(config.root), layout)
          : fileURLToPath(
              new URL("./components/story-layout.astro", import.meta.url)
            );
        const src = fileURLToPath(config.srcDir);
        const stories = getStories({
          base: sanitizedBase,
          patterns,
          root: fileURLToPath(config.root),
          src,
        });

        injectRoute({
          pattern: `${sanitizedBase}/[...story]`,
          entrypoint: new URL("./[...story].astro", import.meta.url),
        });

        const modules = {
          [`${virtualModuleIdPrefix}/config` as const]: `export const stories = ${JSON.stringify(stories)}; export default ${JSON.stringify({ stories })};`,
          [`${virtualModuleIdPrefix}/Layout` as const]: `export { default } from ${JSON.stringify(layoutPath)};`,
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
