import { resolve } from "node:path";
import type {
  ElementContent,
  Element as HastElement,
  Properties,
  Root,
  RootContent,
} from "hast";
import type {
  MdxJsxAttribute,
  MdxJsxFlowElementHast,
} from "mdast-util-mdx-jsx";
import type {
  Transformer as UnifiedTransformer,
  Plugin as UnifiedPlugin,
} from "unified";
import { visit } from "unist-util-visit";
import { isString } from "../../utils/type-checks";

// cSpell:ignore metastring

export const CODE_BLOCK_NAME = "CodeBlock";
export const CODE_BLOCK_PATH = resolve(
  "src/components/molecules/code-block/code-block.astro"
);

const getAttribute = (name: string, value: string): MdxJsxAttribute => {
  return {
    name,
    type: "mdxJsxAttribute",
    value,
  };
};

const getLangAttribute = (
  classNames: Properties[keyof Properties]
): MdxJsxAttribute | undefined => {
  if (!Array.isArray(classNames)) return undefined;

  const langClass = classNames
    .filter(isString)
    .find((className) => className.startsWith("language-"));
  const lang = langClass?.replace("language-", "");

  return isString(lang) ? getAttribute("lang", lang) : undefined;
};

const getAttributeFromKeyValuePair = (prop: string, separator: string) => {
  const [key, value] = prop.split(separator);

  return isString(key) && isString(value)
    ? getAttribute(key, value)
    : undefined;
};

const getAttributeFromBooleanProp = (prop: string) =>
  getAttribute(prop, "true");

const getAttributesFromMetaString = (metaString: string): MdxJsxAttribute[] => {
  const notQuotedSpaces = /\s+(?=(?:(?:[^"']*["']){2})*[^"']*$)/;
  const props = metaString.split(notQuotedSpaces);
  const keyValueSeparator = "=";
  const attrs: MdxJsxAttribute[] = [];

  for (const prop of props) {
    if (prop.includes(keyValueSeparator)) {
      const attr = getAttributeFromKeyValuePair(prop, keyValueSeparator);

      if (attr !== undefined) attrs.push(attr);
    } else {
      attrs.push(getAttributeFromBooleanProp(prop));
    }
  }

  return attrs;
};

const convertPropertiesToAttributes = (
  props: Properties
): MdxJsxAttribute[] => {
  const attrs: MdxJsxAttribute[] = [];

  for (const [prop, value] of Object.entries(props)) {
    if (prop === "className") {
      const langAttr = getLangAttribute(value);

      if (langAttr !== undefined) attrs.push(langAttr);
    } else if (prop === "metastring" && isString(value)) {
      attrs.push(...getAttributesFromMetaString(value));
    }
  }

  return attrs;
};

const getValueFromTextNodeOnly = (node: ElementContent): string | undefined => {
  if (node.type === "text") return node.value;

  // This should never be reached for a `pre` element but I think it is
  // preferable compared to casting in case I'm missing something...
  return undefined;
};

const convertChildrenToCodeAttribute = (children: ElementContent[]) => {
  const value = children
    .map(getValueFromTextNodeOnly)
    .filter(isString)
    .join("\n")
    .replace(/\n$/, "");

  return getAttribute("code", value);
};

/**
 * Build a Hast element equivalent to: `<CodeBlock code={code} lang={lang} />`.
 *
 * @param {HastElement} codeNode - A node describing a code element.
 * @returns {MdxJsxFlowElementHast} The Hast element.
 */
const buildCodeBlockElement = (
  codeNode: HastElement
): MdxJsxFlowElementHast => {
  return {
    name: CODE_BLOCK_NAME,
    type: "mdxJsxFlowElement",
    attributes: [
      convertChildrenToCodeAttribute(codeNode.children),
      ...convertPropertiesToAttributes(codeNode.properties),
    ],
    children: [],
  };
};

const createCodeBlockImportStatement = (): RootContent => {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ImportDeclaration",
            source: {
              type: "Literal",
              value: CODE_BLOCK_PATH,
              raw: JSON.stringify(CODE_BLOCK_PATH),
            },
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: {
                  name: CODE_BLOCK_NAME,
                  type: "Identifier",
                },
              },
            ],
          },
        ],
      },
    },
  };
};

/**
 * Rehype plugin to use the custom CodeBlock component.
 *
 * @returns {UnifiedTransformer<Root>} A transformer function that modifies the AST in place.
 */
export const rehypeCodeBlocks: UnifiedPlugin<[], Root> =
  (): UnifiedTransformer<Root> => (tree, file) => {
    if (file.extname !== ".mdx") return;
    /*
     * We need to cast because of a TypeScript's type narrowing limitation.
     *
     * @see https://typescript-eslint.io/rules/no-unnecessary-condition#when-not-to-use-it
     */
    let isImportNeeded = false as boolean;

    visit(tree, "element", (node, index, nodeParent) => {
      if (node.tagName !== "pre") return;

      const [codeNode] = node.children;

      if (codeNode?.type !== "element" || codeNode.tagName !== "code") return;

      const component = buildCodeBlockElement(codeNode);

      isImportNeeded = true;

      // Replace the pre element with our component
      nodeParent?.children.splice(index ?? 0, 1, component);
    });

    if (isImportNeeded) tree.children.unshift(createCodeBlockImportStatement());
  };
