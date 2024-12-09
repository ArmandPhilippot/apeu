import type { Root } from "hast";
import type { Plugin as UnifiedPlugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin to allow HTML tags to be mapped to custom components.
 */
export const rehypeDisableExplicitJsx: UnifiedPlugin<[], Root> =
  () => (tree) => {
    visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => {
      if (node.data && "_mdxExplicitJsx" in node.data) {
        delete node.data._mdxExplicitJsx;
      }
    });
  };
