/// <reference types="mdast-util-directive" />
import { h } from "hastscript";
import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import type {
  Transformer as UnifiedTransformer,
  Plugin as UnifiedPlugin,
} from "unified";
import { visit } from "unist-util-visit";
import { isValidCalloutType } from "../../utils/callouts";

/**
 * Remark plugin to transform directives to a callout element that matches our
 * custom Callout component. This should be used with components mapping!
 *
 * @returns {UnifiedTransformer<Root>} A transformer function that modifies the AST in place.
 */
export const remarkCallouts: UnifiedPlugin<[], Root> =
  (): UnifiedTransformer<Root> => (tree, file) => {
    if (file.extname !== ".mdx") return;

    visit(tree, (node) => {
      if (
        node.type !== "containerDirective" ||
        !isValidCalloutType(node.name)
      ) {
        return;
      }

      const [firstChild, ...children] = node.children;

      /* We need to handle custom titles (e.g. `:::note[Custom title]`). Using
       * this syntax will produce `<p>Custom title</p>`. So we need to add a
       * label and update the children. */
      if (
        firstChild?.type === "paragraph" &&
        firstChild.data !== undefined &&
        "directiveLabel" in firstChild.data &&
        firstChild.data.directiveLabel === true
      ) {
        // eslint-disable-next-line no-param-reassign -- We must add a label.
        node.attributes = {
          ...node.attributes,
          label: mdastToString(firstChild.children),
        };
        // eslint-disable-next-line no-param-reassign -- We have to update the children.
        node.children = children;
      }

      // eslint-disable-next-line no-param-reassign -- We need to ensure that data is an object.
      node.data ??= {};

      const { data, attributes } = node;
      data.hName = "callout";
      data.hProperties = {
        ...h("callout", attributes ?? {}).properties,
        type: node.name,
      };
    });
  };
