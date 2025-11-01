import type {
  ElementContent,
  Element as HastElement,
  Text as HastText,
} from "hast";
import type { ShikiTransformer } from "shiki";

type ShikiDiffNotationOptions = {
  /**
   * Class to identify lines both added or removed.
   */
  diffClass?: string;
  /**
   * Class for added lines.
   */
  lineAddedClass?: string;
  /**
   * Class for removed lines.
   */
  lineRemovedClass?: string;
};

const getToken = (el: ElementContent | undefined) => {
  if (el?.type === "element") return el.children[0];
  if (el?.type === "text") return el;
  return null;
};

const isCodeFence = (value: string) =>
  value.startsWith("---") || value.startsWith("+++");

const getTokenValue = (token: HastText) => {
  if (isCodeFence(token.value)) return null;
  const [firstChar] = token.value;
  return firstChar === "+" || firstChar === "-" ? firstChar : null;
};


/**
 * A Shiki transformer to support diff notation.
 *
 * @param {ShikiDiffNotationOptions} [options] - The diff notation config.
 * @returns {ShikiTransformer} A transformer to modify the AST.
 */
export function shikiDiffNotation(
  options: ShikiDiffNotationOptions = {}
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
        (child) => child.type === "element"
      )) {
        for (const child of line.children) {
          if (child.type !== "element") continue;

          /* When using `+` or `-` in code blocks, they are wrapped with a
           * `span` so we need to isolate the span and check its first child. */
          const [el] = child.children;

          const token = getToken(el);

          if (token?.type !== "text") continue;

          const tokenValue = getTokenValue(token);

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
