import type { Element as HastElement } from "hast";
import { defineHastPlugin, type MdxJsxAttributeUnion } from "satteri";

const getStringAttribute = (
  attributes: readonly MdxJsxAttributeUnion[],
  name: string
): string | undefined => {
  for (const attr of attributes) {
    if (
      attr.type === "mdxJsxAttribute" &&
      attr.name === name &&
      typeof attr.value === "string"
    ) {
      return attr.value;
    }
  }
  return undefined;
};

/**
 * Given an anchor's `href` and its single child, return the child as a
 * clickable image element if src and href match, or `undefined` otherwise.
 *
 * @param {string | undefined} href - The anchor's href value.
 * @param {HastElement["children"][number] | undefined} child - The single child node.
 * @returns {HastElement | undefined} The clickable image element, or `undefined`.
 */
const resolveClickableImage = (
  href: string | undefined,
  child: HastElement["children"][number] | undefined
): HastElement | undefined => {
  if (
    href === undefined ||
    child?.type !== "element" ||
    child.tagName !== "img" ||
    child.properties.src !== href
  ) {
    return undefined;
  }

  return {
    ...child,
    properties: { ...child.properties, "data-clickable": true },
  };
};

export const hastLinkedImages = defineHastPlugin({
  name: "hast-linked-images",
  element: {
    filter: ["a"],
    visit: (node, ctx) => {
      if (node.children.length !== 1) return;
      const [child] = node.children;
      const href =
        typeof node.properties.href === "string"
          ? node.properties.href
          : undefined;
      const result = resolveClickableImage(href, child);

      if (result !== undefined) ctx.replaceNode(node, result);
    },
  },
  mdxJsxFlowElement: {
    filter: ["a"],
    // Handles HTML <a href="X"><img src="X" /></a> after hastHtmlImages has
    // already converted the inner <img> from mdxJsxFlowElement to element.
    visit: (node): HastElement | undefined => {
      if (node.children.length !== 1) return undefined;
      const [child] = node.children;
      const href = getStringAttribute(node.attributes, "href");

      return resolveClickableImage(href, child);
    },
  },
});
