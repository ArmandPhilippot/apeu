import type { Root } from "hast";
import type {
  Transformer as UnifiedTransformer,
  Plugin as UnifiedPlugin,
} from "unified";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin to allow HTML tags to be mapped to custom components.
 *
 * @returns {UnifiedTransformer<Root>} A transformer function that modifies the AST in place.
 */
export const rehypeDisableExplicitJsx: UnifiedPlugin<[], Root> =
  (): UnifiedTransformer<Root> => (tree) => {
    visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], (node) => {
      if (node.data !== undefined && "_mdxExplicitJsx" in node.data) {
        /* eslint-disable-next-line no-param-reassign -- We need to delete this property to be able to map HTML tags to custom components. */
        delete node.data._mdxExplicitJsx;
      }
    });
  };
