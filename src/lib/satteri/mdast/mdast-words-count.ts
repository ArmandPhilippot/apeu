import { fileURLToPath } from "node:url";
import { toNlcst } from "mdast-util-to-nlcst";
import type { RootContent } from "nlcst";
import { ParseEnglish } from "parse-english";
import { ParseLatin } from "parse-latin";
import { defineMdastPlugin, type MdastNode } from "satteri";
import { VFile } from "vfile";
import { getLocaleFromPath } from "../../../utils/paths";

// Climbs the live tree via `ctx.parent` instead of re-parsing `ctx.source`: a
// fresh reparse can't tell MDX from plain Markdown, so it would drop words
// inside MDX-only constructs (e.g. `mdxJsxFlowElement`/`mdxJsxTextElement`).
const findRoot = (
  startNode: Readonly<MdastNode>,
  getParent: (node: Readonly<MdastNode>) => Readonly<MdastNode> | undefined
): Readonly<MdastNode> => {
  let root = startNode;
  let ancestor = getParent(root);
  while (ancestor !== undefined) {
    root = ancestor;
    ancestor = getParent(root);
  }
  return root;
};

const flattenNlcstTree = (tree: RootContent[]): RootContent[] =>
  tree.flatMap((child) => {
    if (child.type === "ParagraphNode" || child.type === "SentenceNode") {
      return flattenNlcstTree(child.children);
    }

    return child;
  });

const isWordNodeType = (node: RootContent) => node.type === "WordNode";

export const mdastWordsCount = defineMdastPlugin({
  name: "mdast-words-count",
  text: (node, ctx) => {
    if (ctx.data.wordsCountProcessed === true) return;
    // eslint-disable-next-line no-param-reassign -- We need to mark the words count as processed to avoid processing it multiple times.
    ctx.data.wordsCountProcessed = true;
    const tree = findRoot(node, (n) => ctx.parent(n));
    const currentLocale = getLocaleFromPath(
      ctx.fileURL === undefined ? "unknown" : fileURLToPath(ctx.fileURL)
    );
    const parser = currentLocale === "en" ? ParseEnglish : ParseLatin;
    const file = new VFile({
      path: ctx.fileURL === undefined ? "unknown" : fileURLToPath(ctx.fileURL),
      value: ctx.source,
    });
    const nlcst = toNlcst(tree, file, parser);
    const wordsCount = flattenNlcstTree(nlcst.children).filter(
      isWordNodeType
    ).length;

    if (ctx.data.astro !== undefined) {
      // eslint-disable-next-line no-param-reassign -- We need to add the wordsCount property to the frontmatter object to retrieve it later.
      ctx.data.astro.frontmatter.wordsCount = wordsCount;
    }
  },
});
