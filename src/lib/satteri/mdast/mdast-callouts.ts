import { h } from "hastscript";
import type { BlockContent, DefinitionContent, Nodes } from "mdast";
import { defineMdastPlugin } from "satteri";
import { isValidCalloutType } from "../../../utils/type-guards";

// Sätteri doesn't expose this type. We need it to type the callback function for getting the text content of a node.
type MdastTextContent = (
  node: Readonly<Nodes>,
  options?: {
    includeImageAlt?: boolean;
    includeHtml?: boolean;
  }
) => string;

const getCalloutLabel = (
  node: BlockContent | DefinitionContent | undefined,
  getTextContent: MdastTextContent
): string | null => {
  const hasLabel =
    node?.type === "paragraph" &&
    node.data?.directiveLabel === true &&
    node.children.length > 0;

  return hasLabel ? getTextContent(node) : null;
};

/**
 * Mdast plugin to transform directives to a callout element that matches our
 * custom Callout component. Use it with MDX components mapping.
 */
export const mdastCallouts = defineMdastPlugin({
  name: "callouts",
  containerDirective(node, ctx) {
    if (!isValidCalloutType(node.name)) return;

    /* We need to handle custom titles (e.g. `:::note[Custom title]`). This syntax will produce `<p>Custom title</p>` as first child. So, we need to add a label and update the children. */
    const [firstChild, ...children] = node.children;
    console.log("firstChild", firstChild);
    console.log("firstChild.data", firstChild?.data);
    const label = getCalloutLabel(firstChild, ctx.textContent.bind(ctx));

    ctx.replaceNode(node, {
      ...node,
      children: label === null ? node.children : children,
      data: {
        hName: "callout",
        hProperties: {
          ...h("callout", { ...node.attributes, label }).properties,
          type: node.name,
        },
      },
    });
  },
});
