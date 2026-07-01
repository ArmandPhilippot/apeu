import type { Properties } from "hast";
import isRelativeUrl from "is-relative-url";
import {
  defineHastPlugin,
  type HastFilteredVisitor,
  type MdxJsxAttributeUnion,
  type MdxJsxFlowElementHast,
  type MdxJsxTextElementHast,
} from "satteri";

/**
 * A partial list of standard HTML element names. Contains only the most likely to be used in MDX.
 */
const HTML_TAG_NAMES = [
  "a",
  "abbr",
  "address",
  "blockquote",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
  "ins",
  "kbd",
  "li",
  "mark",
  "ol",
  "output",
  "p",
  "picture",
  "pre",
  "q",
  "samp",
  "section",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
];

const addImageSrcToAstroContext = (
  src: string,
  ctx: Parameters<HastFilteredVisitor<MdxJsxFlowElementHast>["visit"]>[1]
) => {
  if (isRelativeUrl(src, { allowProtocolRelative: false })) {
    ctx.data.astro?.localImagePaths.add(decodeURI(src));
  } else {
    ctx.data.astro?.remoteImagePaths.add(decodeURI(src));
  }
};

const convertAttributesToProperties = (
  attributes: readonly MdxJsxAttributeUnion[]
): Properties => {
  const properties: Properties = {};
  for (const attr of attributes) {
    if (attr.type !== "mdxJsxAttribute") continue;
    if (attr.value === null || attr.value === undefined) {
      properties[attr.name] = true;
    } else if (typeof attr.value === "string") {
      properties[attr.name] = attr.value;
    }
  }
  return properties;
};

const hastElementConverter: HastFilteredVisitor<
  MdxJsxFlowElementHast | MdxJsxTextElementHast
> = {
  filter: HTML_TAG_NAMES,
  visit: (node, ctx) => {
    if (node.name === null) {
      throw new Error(
        "Unexpected null name in mdxJsxFlowElement or mdxJsxTextElement"
      );
    }

    const properties = convertAttributesToProperties(node.attributes);
    if (node.name === "img" && typeof properties.src === "string") {
      addImageSrcToAstroContext(properties.src, ctx);
    }

    return {
      type: "element",
      tagName: node.name,
      children: node.children,
      properties,
    };
  },
};

/**
 * A plugin to convert MDX JSX elements to HAST elements, handling HTML syntax.
 *
 * This plugin ensures that standard HTML elements in MDX are converted to HAST elements, while also registering image sources for Astro's image pipeline.
 *
 * This is a replacement for `_mdxExplicitJsx` in the unified pipeline, where removing that flag allowed HTML tags to be mapped to custom components.
 *
 * @returns {ReturnType<typeof defineHastPlugin>} A Sätteri HAST plugin.
 */
export const hastMdxHtmlSyntax = defineHastPlugin({
  name: "hastMdxHtmlSyntax",
  mdxJsxFlowElement: hastElementConverter,
  mdxJsxTextElement: hastElementConverter,
});
