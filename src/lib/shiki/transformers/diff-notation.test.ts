import type { Element as HastElement } from "hast";
import type { ShikiTransformerContext } from "shiki";
import { describe, expect, it } from "vitest";
import { isString } from "../../../utils/type-checks";
import { shikiDiffNotation } from "./diff-notation";

/**
 * Retrieves the first line in a node.
 *
 * @param {HastElement} node - A Hast node.
 * @returns {HastElement} The first line in the node.
 * @throws When the first line is not an element.
 */
function getFirstLine(node: HastElement): HastElement {
  const [firstLine] = node.children;

  if (firstLine?.type !== "element") {
    throw new Error("Expected child to be an element");
  }

  return firstLine;
}

/**
 * Extracts text from a mock node's child, removing diff symbols (+/-).
 * Throws an error if the node structure is unexpected.
 *
 * @param {HastElement} node - A Hast node.
 * @returns {string} The text extracted from the node.
 * @throws When the text can't be extracted.
 */
function extractTextFromNode(node: HastElement): string {
  const [line] = node.children;
  if (line?.type !== "element") {
    throw new Error("Unable to extract text from node");
  }

  const [tokenNode] = line.children;
  if (tokenNode?.type !== "text") {
    throw new Error("Unable to extract text from node");
  }

  return tokenNode.value.replace(/^[+-]\s*/, "").trim();
}

/**
 * Retrieves the class names from a node's properties as an array.
 *
 * @param {HastElement} node - The Hast node.
 * @returns {string[]} A list of classnames.
 */
function getNodeClasses(node: HastElement): string[] {
  return (node.properties.className ?? []) as string[];
}

/**
 * Creates a context object for the transformer, enabling class addition to
 * nodes.
 *
 * @returns {ShikiTransformerContext} - The transformer context to be used with Hast.
 */
function createTransformerContext(): ShikiTransformerContext {
  return {
    addClassToHast(
      hast: HastElement,
      className: string | string[]
    ): HastElement {
      hast.properties.className = isString(className) ? [className] : className;
      return hast;
    },
  } as ShikiTransformerContext;
}

/**
 * Creates a mock HastElement node for testing purposes.
 *
 * @param {string} value - The textual value of the element.
 * @param {"text" | "comment"} [type] - The element type.
 * @returns {HastElement} A Hast element.
 */
function createMockNode(
  value: string,
  type: "text" | "comment" = "text"
): HastElement {
  return {
    type: "element",
    tagName: "div",
    properties: {},
    children: [
      {
        type: "element",
        tagName: "span",
        properties: {},
        children: [
          type === "text"
            ? {
                type: "element",
                tagName: "span",
                properties: {},
                children: [{ type: "text", value }],
              }
            : { type: "comment", value },
        ],
      },
    ],
  };
}

describe("shikiDiffNotation transformer", () => {
  it("should add diff classes for added lines", () => {
    const mockNode = createMockNode("+ Added line");
    const context = createTransformerContext();
    const transformer = shikiDiffNotation();

    transformer.code?.call(context, mockNode);

    const firstLine = getFirstLine(mockNode);

    expect(extractTextFromNode(firstLine)).toBe("Added line");
    expect(getNodeClasses(firstLine)).toStrictEqual(["diff", "add"]);
  });

  it("should add diff classes for removed lines", () => {
    const mockNode = createMockNode("- Removed line");
    const context = createTransformerContext();
    const transformer = shikiDiffNotation();

    transformer.code?.call(context, mockNode);

    const firstLine = getFirstLine(mockNode);

    expect(extractTextFromNode(firstLine)).toBe("Removed line");
    expect(getNodeClasses(firstLine)).toStrictEqual(["diff", "remove"]);
  });

  it("should handle custom class names", () => {
    const mockNode = createMockNode("+ Added line");
    const context = createTransformerContext();
    const transformer = shikiDiffNotation({
      diffClass: "custom-diff",
      lineAddedClass: "custom-add",
      lineRemovedClass: "custom-remove",
    });

    transformer.code?.call(context, mockNode);

    const firstLine = getFirstLine(mockNode);

    expect(extractTextFromNode(firstLine)).toBe("Added line");
    expect(getNodeClasses(firstLine)).toStrictEqual([
      "custom-diff",
      "custom-add",
    ]);
  });

  it("should not modify lines without diff notation", () => {
    const mockNode = createMockNode("Normal line");
    const context = createTransformerContext();
    const transformer = shikiDiffNotation();

    transformer.code?.call(context, mockNode);

    const firstLine = getFirstLine(mockNode);

    expect(extractTextFromNode(firstLine)).toBe("Normal line");
    expect(firstLine.properties.className).toBeUndefined();
  });

  it("should handle edge case with unexpected child type", () => {
    const mockNode = createMockNode("Custom type", "comment");
    const context = createTransformerContext();
    const transformer = shikiDiffNotation();

    transformer.code?.call(context, mockNode);

    const firstLine = getFirstLine(mockNode);

    expect(firstLine.properties.className).toBeUndefined();
  });

  it("should handle partially overridden options", () => {
    const mockNode = createMockNode("+ Partially overridden");
    const context = createTransformerContext();
    const transformer = shikiDiffNotation({
      lineAddedClass: "custom-add",
    });

    transformer.code?.call(context, mockNode);

    const firstLine = getFirstLine(mockNode);

    expect(getNodeClasses(firstLine)).toStrictEqual(["diff", "custom-add"]);
  });

  it("should handle an element with no children", () => {
    const mockNode: HastElement = {
      type: "element",
      tagName: "div",
      properties: {},
      children: [],
    };
    const context = createTransformerContext();
    const transformer = shikiDiffNotation();

    transformer.code?.call(context, mockNode);

    // Without children, there should be no class changes
    expect(mockNode.properties.className).toBeUndefined();
  });

  it("should handle node with empty children array", () => {
    const emptyChildrenNode: HastElement = {
      type: "element",
      tagName: "div",
      properties: {},
      children: [],
    };

    const context = createTransformerContext();
    const transformer = shikiDiffNotation();

    expect(() =>
      transformer.code?.call(context, emptyChildrenNode)
    ).not.toThrow();
    expect(emptyChildrenNode.properties.className).toBeUndefined();
  });
});
