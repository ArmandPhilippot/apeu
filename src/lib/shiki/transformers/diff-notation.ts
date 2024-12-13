import type { Element as HastElement } from "hast";
import type { ShikiTransformer } from "shiki";

type ShikiDiffNotationOptions = {
  /**
   * Class to identify lines both added or removed.
   */
  diffClass?: string;
  /**
   * Class for added lines
   */
  lineAddedClass?: string;
  /**
   * Class for removed lines
   */
  lineRemovedClass?: string;
};

export function shikiDiffNotation(
  options: ShikiDiffNotationOptions = {},
): ShikiTransformer {
  const {
    diffClass = "diff",
    lineAddedClass = "add",
    lineRemovedClass = "remove",
  } = options;

  return {
    name: "shiki-diff-notation",
    code(node: HastElement) {
      for (const line of node.children.filter(
        (child) => child.type === "element",
      )) {
        for (const child of line.children) {
          if (child.type !== "element") continue;

          /* When using `+` or `-` in code blocks, they are wrapped with a
           * `span` so we need to isolate the span and check its first child. */
          const el = child.children[0];

          const token =
            el?.type === "element"
              ? el.children[0]
              : el?.type === "text"
                ? el
                : null;

          if (!token || token.type !== "text") continue;

          const tokenValue = token.value.startsWith("+")
            ? "+"
            : token.value.startsWith("-")
              ? "-"
              : null;

          if (tokenValue) {
            /* We cannot use `child.children.shift()` because in addition of
             * the diff token, the span could contain indentation. */
            token.value = token.value.replace(tokenValue, "");
            this.addClassToHast(line, [
              diffClass,
              tokenValue === "+" ? lineAddedClass : lineRemovedClass,
            ]);
          }
        }
      }
    },
  };
}
