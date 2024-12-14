/// <reference types="mdast-util-directive" />
import { h } from "hastscript";
import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Plugin as UnifiedPlugin } from "unified";
import { visit } from "unist-util-visit";
import { isValidCalloutType } from "../../utils/callouts";

/**
 * Remark plugin to transform directives to a callout element that matches our
 * custom Callout component. Should be used with components mapping!
 */
export const remarkCallouts: UnifiedPlugin<[], Root> = () => (tree, file) => {
  if (file.extname !== ".mdx") return;

  visit(tree, (node) => {
    if (node.type !== "containerDirective" || !isValidCalloutType(node.name))
      return;

    const [firstChildren, ...children] = node.children;

    if (
      firstChildren?.type === "paragraph" &&
      firstChildren?.data &&
      "directiveLabel" in firstChildren.data &&
      firstChildren.data.directiveLabel
    ) {
      node.attributes = {
        ...node.attributes,
        label: mdastToString(firstChildren.children),
      };
      node.children = children;
    }

    const data = node.data || (node.data = {});
    data.hName = "callout";
    data.hProperties = {
      ...h("callout", node.attributes || {}).properties,
      type: node.name,
    };
  });
};
