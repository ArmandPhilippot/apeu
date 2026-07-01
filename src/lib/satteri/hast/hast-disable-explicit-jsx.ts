import type { Element as HastElement, Properties } from "hast";
import {
  defineHastPlugin,
  type MdxJsxAttributeUnion,
  type MdxJsxFlowElementHast,
  type MdxJsxTextElementHast,
} from "satteri";

/**
 * Current standard HTML element names (deprecated/obsolete tags such as
 * `<frameset>` or `<marquee>` are intentionally left out — add them here if
 * content ever needs them).
 */
const HTML_TAG_NAMES = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
];

/**
 * Extract attributes from a JSX node into HAST `Properties`.
 *
 * Expression-valued attributes (e.g. `style={{...}}`) and spreads can't be
 * resolved statically and are dropped; value-less attributes (e.g.
 * `disabled`) become boolean `true`, matching JSX semantics.
 *
 * @param {readonly MdxJsxAttributeUnion[]} attributes - The JSX node attributes.
 * @returns {Properties} The HAST properties.
 */
const collectProperties = (
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

/**
 * Convert a matched MDX JSX node into a plain HAST `element` with the same
 * tag name, attributes and children.
 *
 * @param {MdxJsxFlowElementHast | MdxJsxTextElementHast} node - The MDX JSX node.
 * @returns {HastElement} The equivalent HAST element.
 */
const toElement = (
  node: Readonly<MdxJsxFlowElementHast | MdxJsxTextElementHast>
): HastElement => {
  return {
    type: "element",
    tagName: node.name ?? "div",
    properties: collectProperties(node.attributes),
    children: node.children,
  };
};

// Img is handled separately by hastHtmlImages, which keeps remote sources
// as literal JSX instead of converting them.
const filter = HTML_TAG_NAMES;

/**
 * Converts HTML tags written as JSX in MDX (e.g. `<div>`) into plain HAST
 * `element` nodes, so they're treated like their Markdown-sourced
 * equivalents instead of compiling to a literal native tag.
 *
 * Sätteri's `_mdxExplicitJsx` flag is internal compiler state, not a real
 * `data` field — mutating it (directly or via `ctx.setProperty`) has no
 * effect unlike unified, so replacing the node is the only way to achieve this.
 */
export const hastDisableExplicitJsx = defineHastPlugin({
  name: "hast-disable-explicit-jsx",
  mdxJsxFlowElement: { filter, visit: toElement },
  mdxJsxTextElement: { filter, visit: toElement },
});
