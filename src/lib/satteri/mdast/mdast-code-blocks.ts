import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  defineMdastPlugin,
  type MdastContent,
  type MdxJsxAttributeNode,
  type MdxJsxAttributeValueExpressionNode,
  type MdxJsxAttributeUnion,
} from "satteri";

export const CODE_BLOCK_NAME = "CodeBlock";
export const CODE_BLOCK_PATH = resolve(
  "src/components/molecules/code-block/code-block.astro"
);

/**
 * Build a `mdxJsxAttribute` node with the given name and value.
 *
 * @param {string} name - The JSX attribute name (e.g. `"lang"`, `"code"`).
 * @param {MdxJsxAttributeNode["value"]} value - The JSX attribute value, or `null` for boolean attributes.
 * @returns {MdxJsxAttributeNode} The constructed attribute node.
 */
const getAttribute = (
  name: string,
  value: MdxJsxAttributeNode["value"]
): MdxJsxAttributeNode => {
  return {
    name,
    type: "mdxJsxAttribute",
    value,
  };
};

/**
 * Parse the raw string after `=` in a code block meta token into the correct `MdxJsxAttribute` value type.
 *
 * - `{expr}` → `MdxJsxAttributeValueExpression` (numbers, booleans, JS expressions).
 * - `"..."` or `'...'` → plain string (quotes stripped).
 * - bare value → plain string as-is.
 *
 * @param {string} rawValue - The raw value string, as it appears after `=` in the meta.
 * @returns {MdxJsxAttributeNode["value"]} The parsed attribute value.
 */
const parseAttributeValue = (
  rawValue: string
): MdxJsxAttributeNode["value"] => {
  if (rawValue.startsWith("{") && rawValue.endsWith("}")) {
    const expression: MdxJsxAttributeValueExpressionNode = {
      type: "mdxJsxAttributeValueExpression",
      value: rawValue.slice(1, -1),
    };

    return expression;
  }

  if (
    (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
  ) {
    return rawValue.slice(1, -1);
  }

  return rawValue;
};

/**
 * Matches whitespace that is not enclosed in single or double quotes.
 * Used to split a meta string like `key="val with spaces" other` into tokens
 * without breaking quoted values.
 */
const SPACES_OUTSIDE_QUOTES = /\s+(?=(?:(?:[^"']*["']){2})*[^"']*$)/;

/**
 * Parse a code block meta string (e.g. `showLineNumbers filePath="./foo.js"
 * lineStart={10}`) into an array of `MdxJsxAttribute` nodes.
 *
 * - Tokens without `=` become boolean attributes (`value: null`).
 * - Tokens with `=` are split into key/value pairs and the value is parsed by
 * {@link parseAttributeValue}.
 *
 * @param {string | null | undefined} meta - The raw meta string from the code node.
 * @returns {MdxJsxAttributeUnion[]} The parsed attribute nodes.
 */
const getAttributesFromMetadata = (
  meta: string | null | undefined
): MdxJsxAttributeUnion[] => {
  if (meta === null || meta === undefined) return [];

  const attrs: MdxJsxAttributeUnion[] = [];

  for (const prop of meta.split(SPACES_OUTSIDE_QUOTES)) {
    const eqIndex = prop.indexOf("=");

    if (eqIndex === -1) {
      attrs.push(getAttribute(prop, null));
    } else {
      const key = prop.slice(0, eqIndex);
      const rawValue = prop.slice(eqIndex + 1);

      if (key) attrs.push(getAttribute(key, parseAttributeValue(rawValue)));
    }
  }

  return attrs;
};

/**
 * Build an mdast element equivalent to:
 * `<CodeBlock lang={lang} code={code} {...metaProps} />`.
 *
 * @param {object} node - A mdast `code` node.
 * @param {string | null | undefined} node.lang - The language identifier.
 * @param {string | null | undefined} node.meta - The raw meta string.
 * @param {string} node.value - The code content.
 * @returns {MdastContent} The replacement mdast element.
 */
const buildCodeBlockComponent = (
  node: Readonly<{
    lang?: string | null | undefined;
    meta?: string | null | undefined;
    value: string;
  }>
): MdastContent => {
  return {
    type: "mdxJsxFlowElement",
    name: CODE_BLOCK_NAME,
    attributes: [
      ...getAttributesFromMetadata(node.meta),
      getAttribute("lang", node.lang ?? ""),
      getAttribute("code", node.value),
    ],
    children: [],
  };
};

/**
 * Inject a single `import CodeBlock from "..."` statement before the first
 * code block in a document. Subsequent code blocks in the same document are
 * skipped via `ctx.data.codeBlockImported`.
 *
 * @param {Parameters<typeof mdastCodeBlocks.code>[0]} node - The current code node.
 * @param {Parameters<typeof mdastCodeBlocks.code>[1]} ctx - The Sätteri visitor context.
 */
const insertCodeBlockImport = (
  node: Parameters<typeof mdastCodeBlocks.code>[0],
  ctx: Parameters<typeof mdastCodeBlocks.code>[1]
): void => {
  const { data } = ctx;

  if (data.codeBlockImported !== true) {
    const importStatement = `import ${CODE_BLOCK_NAME} from "${CODE_BLOCK_PATH}";\n`;
    ctx.insertBefore(node, { type: "mdxjsEsm", value: importStatement });
    data.codeBlockImported = true;
  }
};

/**
 * Sätteri mdast plugin that replaces fenced code blocks in MDX files with the
 * custom `CodeBlock` component, forwarding `lang`, `code`, and all meta-string
 * props as JSX attributes.
 *
 * Only MDX files are processed — plain Markdown does not support JSX or import
 * statements.
 */
export const mdastCodeBlocks = defineMdastPlugin({
  name: "mdast-code-blocks",
  code: (node, ctx) => {
    const filePath = fileURLToPath(ctx.fileURL ?? "");
    // Only MDX supports JSX and import statements
    if (!filePath.endsWith(".mdx")) return;

    insertCodeBlockImport(node, ctx);
    ctx.replaceNode(node, buildCodeBlockComponent(node));
  },
});
