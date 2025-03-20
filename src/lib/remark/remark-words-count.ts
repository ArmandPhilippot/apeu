import type { Root } from "mdast";
import { toNlcst } from "mdast-util-to-nlcst";
import type { RootContent } from "nlcst";
import { ParseEnglish } from "parse-english";
import { ParseLatin } from "parse-latin";
import type {
  Transformer as UnifiedTransformer,
  Plugin as UnifiedPlugin,
} from "unified";
import { getLocaleFromPath } from "../../utils/paths";

const flattenNlcstTree = (tree: RootContent[]): RootContent[] =>
  tree.flatMap((child) => {
    if (child.type === "ParagraphNode" || child.type === "SentenceNode") {
      return flattenNlcstTree(child.children);
    }

    return child;
  });

const isWordNodeType = (node: RootContent) => node.type === "WordNode";

/**
 * Remark plugin to retrieve the words count from a Markdown file.
 *
 * @returns {UnifiedTransformer<Root>} A transformer function that modifies the AST in place.
 */
export const remarkWordsCount: UnifiedPlugin<[], Root> =
  (): UnifiedTransformer<Root> => (tree, file) => {
    if (file.data.astro?.frontmatter === undefined) return;

    const currentLocale = getLocaleFromPath(file.path);
    const parser = currentLocale === "en" ? ParseEnglish : ParseLatin;
    const nlcst = toNlcst(tree, file, parser);
    const wordsCount = flattenNlcstTree(nlcst.children).filter(
      isWordNodeType
    ).length;

    // eslint-disable-next-line no-param-reassign -- We need to add the wordsCount property to the frontmatter object to retrieve it later.
    file.data.astro.frontmatter.wordsCount = wordsCount;
  };
