import type { SatteriAstroData } from "@astrojs/markdown-satteri";
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
 * the downstream `createImageMarkerPlugin` can process it.
 *
 * @param {SatteriAstroData | undefined} astro - The Astro data bag for the current document.
 * @param {string} src - The image source attribute value.
 */
const registerLocalSrc = (
  astro: SatteriAstroData | undefined,
  src: string
): void => {
  if (isRelativeLocalSrc(src)) {
    astro?.localImagePaths.add(decodeURI(src));
  }
};

/**
 * Shared visitor for both flow and inline MDX JSX `<img>` nodes.
 *
 * Converts the node to a plain HAST `element` img and registers its source
 * for downstream image processing — **only** when the src is a local relative
 * path. Remote URLs and absolute paths are left as `mdxJsxFlowElement` so
 * the MDX compiler emits them as a raw `_jsx("img", {...})` call rather than
 * routing them through `_components.img` (Astro's Image component), which
 * would fail because those sources are not registered in `remoteImagePaths`.
 *
 * @param {{ attributes: readonly MdxJsxAttributeUnion[] }} node - The MDX JSX img node.
 * @param {readonly MdxJsxAttributeUnion[]} node.attributes - The JSX node attributes.
 * @param {HastVisitorContext} ctx - The Sätteri visitor context.
 * @returns {HastElement | undefined} The replacement HAST element, or `undefined` to leave the node unchanged.
 */
const visitImgNode = (
  node: { attributes: readonly MdxJsxAttributeUnion[] },
  ctx: HastVisitorContext
): HastElement | undefined => {
  const properties = collectProperties(node.attributes);
  const src = typeof properties.src === "string" ? properties.src : undefined;

  if (src !== undefined && !isRelativeLocalSrc(src)) return undefined;

  if (src !== undefined) {
    registerLocalSrc(ctx.data.astro, src);
  }

  return { type: "element", tagName: "img", properties, children: [] };
};

/**
 * Convert `mdxJsxFlowElement` and `mdxJsxTextElement` `<img>` nodes (HTML
 * syntax in MDX) into regular HAST `element` img nodes, and register their
 * sources in `ctx.data.astro.localImagePaths` so the downstream image-marker
 * plugin can process them.
 *
 * This covers the gap left by `_mdxExplicitJsx` in the old `@mdx-js/mdx`
 * pipeline, where removing that flag allowed HTML tags to be treated as
 * Markdown-style images.
 */
export const hastHtmlImages = defineHastPlugin({
  name: "hast-html-images",
  mdxJsxFlowElement: {
    filter: ["img"],
    visit: visitImgNode,
  },
  mdxJsxTextElement: {
    filter: ["img"],
    visit: visitImgNode,
  },
});
