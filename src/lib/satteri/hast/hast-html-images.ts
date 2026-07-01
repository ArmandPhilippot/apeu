import type { SatteriAstroData } from "@astrojs/markdown-satteri";
import { isRemoteAllowed, type RemotePattern } from "astro/assets/utils";
import type { Element as HastElement, Properties } from "hast";
import {
  defineHastPlugin,
  type HastVisitorContext,
  type MdxJsxAttributeUnion,
} from "satteri";

const isRelativeLocalSrc = (src: string) =>
  !src.startsWith("/") && !URL.canParse(src);

/**
 * Extract string-valued attributes from a JSX node into HAST `Properties`.
 *
 * Non-string values (expression attributes, JSX expressions) are omitted —
 * HTML `<img>` attributes are always plain strings.
 *
 * @param {readonly MdxJsxAttributeUnion[]} attributes - The JSX node attributes.
 * @returns {Properties} The HAST properties.
 */
const collectProperties = (
  attributes: readonly MdxJsxAttributeUnion[]
): Properties => {
  const properties: Properties = {};

  for (const attr of attributes) {
    if (attr.type === "mdxJsxAttribute" && typeof attr.value === "string") {
      properties[attr.name] = attr.value;
    }
  }

  return properties;
};

/**
 * Register a local relative image source in Astro's `localImagePaths` set so
 * the downstream `createImageToComponentPlugin` (in `@astrojs/mdx`) can
 * process it.
 *
 * @param {SatteriAstroData | undefined} astro - The Astro data bag for the current document.
 * @param {string} src - The image source attribute value.
 */
const registerLocalSrc = (
  astro: SatteriAstroData | undefined,
  src: string
): void => {
  astro?.localImagePaths.add(decodeURI(src));
};

/**
 * Register an allowed remote image source in Astro's `remoteImagePaths` set,
 * same purpose as {@link registerLocalSrc} but for remote URLs.
 *
 * @param {SatteriAstroData | undefined} astro - The Astro data bag for the current document.
 * @param {string} src - The image source attribute value.
 */
const registerRemoteSrc = (
  astro: SatteriAstroData | undefined,
  src: string
): void => {
  astro?.remoteImagePaths.add(decodeURI(src));
};

type RemoteImageConfig = {
  domains: string[];
  remotePatterns: RemotePattern[];
};

/**
 * Shared visitor for both flow and inline MDX JSX `<img>` nodes.
 *
 * Converts the node to a plain HAST `element` img and registers its source
 * for downstream processing by `@astrojs/mdx` — local relative sources
 * always, remote ones only when allowed by `image.domains` /
 * `image.remotePatterns` (mirroring `createCollectImagesPlugin`, the
 * equivalent collector for Markdown-syntax images). A disallowed remote
 * source, or an absolute path, is left as `mdxJsxFlowElement` so the MDX
 * compiler emits a literal `_jsx("img", {...})` instead of routing it
 * through `_components.img`, which would otherwise reach Astro's image
 * pipeline and fail.
 *
 * @param {{ attributes: readonly MdxJsxAttributeUnion[] }} node - The MDX JSX img node.
 * @param {readonly MdxJsxAttributeUnion[]} node.attributes - The JSX node attributes.
 * @param {HastVisitorContext} ctx - The Sätteri visitor context.
 * @param {RemoteImageConfig} image - The allowed remote domains/patterns.
 * @returns {HastElement | undefined} The replacement HAST element, or `undefined` to leave the node unchanged.
 */
const visitImgNode = (
  node: { attributes: readonly MdxJsxAttributeUnion[] },
  ctx: HastVisitorContext,
  image: RemoteImageConfig
): HastElement | undefined => {
  const properties = collectProperties(node.attributes);
  const src = typeof properties.src === "string" ? properties.src : undefined;

  if (src !== undefined) {
    if (isRelativeLocalSrc(src)) {
      registerLocalSrc(ctx.data.astro, src);
    } else if (isRemoteAllowed(src, image)) {
      registerRemoteSrc(ctx.data.astro, src);
    } else {
      return undefined;
    }
  }

  return { type: "element", tagName: "img", properties, children: [] };
};

/**
 * Build a HAST plugin that converts `mdxJsxFlowElement` and
 * `mdxJsxTextElement` `<img>` nodes (HTML syntax in MDX) into regular HAST
 * `element` img nodes, registering their sources in `ctx.data.astro` so
 * `@astrojs/mdx`'s image pipeline picks them up.
 *
 * This covers the gap left by `_mdxExplicitJsx` in the old `@mdx-js/mdx`
 * pipeline, where removing that flag allowed HTML tags to be treated as
 * Markdown-style images.
 *
 * @param {object} image - The same `domains`/`remotePatterns` passed to Astro's top-level `image` config.
 * @param {readonly string[]} [image.domains] - Allowed remote image domains.
 * @param {readonly RemotePattern[]} [image.remotePatterns] - Allowed remote image patterns.
 * @returns {ReturnType<typeof defineHastPlugin>} A Sätteri HAST plugin.
 */
export const hastHtmlImages = (
  image: {
    domains?: readonly string[];
    remotePatterns?: readonly RemotePattern[];
  } = {}
) => {
  const remoteConfig: RemoteImageConfig = {
    domains: [...(image.domains ?? [])],
    remotePatterns: [...(image.remotePatterns ?? [])],
  };
  const visit = (
    node: { attributes: readonly MdxJsxAttributeUnion[] },
    ctx: HastVisitorContext
  ): HastElement | undefined => visitImgNode(node, ctx, remoteConfig);

  return defineHastPlugin({
    name: "hast-html-images",
    mdxJsxFlowElement: { filter: ["img"], visit },
    mdxJsxTextElement: { filter: ["img"], visit },
  });
};
