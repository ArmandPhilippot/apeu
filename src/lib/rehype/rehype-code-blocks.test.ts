import { compileSync } from "@mdx-js/mdx";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";
import {
  CODE_BLOCK_NAME,
  CODE_BLOCK_PATH,
  rehypeCodeBlocks,
} from "./rehype-code-blocks";

// cSpell:ignore metastring

/**
 * Rehype plugin used by Astro to copy meta into metastring
 *
 * @see https://github.com/withastro/astro/blob/799c8676dfba0d281faf2a3f2d9513518b57593b/packages/integrations/mdx/src/rehype-meta-string.ts
 */
const rehypeMetaString = () => (tree: Root) => {
  visit(tree, (node) => {
    if (node.type === "element" && node.tagName === "code" && node.data?.meta) {
      node.properties.metastring = node.data.meta;
    }
  });
};

/**
 * Custom Rehype plugin to inject a non-text node into the code block
 */
const injectNonTextNode = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "code") {
      // Inject a non-text node directly into the children
      node.children.push({
        type: "element",
        tagName: "div",
        children: [],
        properties: {},
      });
    }
  });
};

describe("rehype-mdx-code-blocks", () => {
  it("should convert a fenced code block to a CodeBlock component", () => {
    const mdx = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      rehypePlugins: [rehypeCodeBlocks],
    });

    expect(result.value).toContain(`import ${CODE_BLOCK_NAME} from`);
    expect(result.value).toContain(CODE_BLOCK_PATH);
    expect(result.value).toMatch(`jsx(CodeBlock, {
    code: "console.log('Hello, world!');",
    lang: "js"
  })`);
  });

  it("should handle fenced code block with multiple lines", () => {
    const mdx = `
\`\`\`js
const answerToUniverse = 42;

console.log('Hello, world!');
console.log("The answer to universe is:" + answerToUniverse);
\`\`\`
`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      rehypePlugins: [rehypeCodeBlocks],
    });

    expect(result.value).toMatch(`jsx(CodeBlock, {
    code: ${JSON.stringify(mdx.replace("\n```js\n", "").replace("\n```\n", ""))},
    lang: "js"
  })`);
  });

  it("should transform additional meta to CodeBlock properties", () => {
    const mdx = `
    \`\`\`js showLineNumbers filePath='./hello.js'
    console.log('Hello, world!');
    \`\`\`
    `;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      rehypePlugins: [rehypeMetaString, rehypeCodeBlocks],
    });

    expect(result.value).toContain(`import ${CODE_BLOCK_NAME} from`);
    expect(result.value).toContain(CODE_BLOCK_PATH);
    expect(result.value).toMatch(`jsx(CodeBlock, {
    code: "console.log('Hello, world!');",
    lang: "js",
    showLineNumbers: "true",
    filePath: "'./hello.js'"
  })`);
  });

  it("should add a single import statement when the file contains multiple code blocks", () => {
    const mdx = `
First code block:

\`\`\`js
console.log('Hello, world!');
\`\`\`

Second code block:

\`\`\`js
console.log('The answer is:', 42);
\`\`\`
`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      rehypePlugins: [rehypeCodeBlocks],
    });
    const value = result.value.toString();

    const importStatements = [
      ...value.matchAll(new RegExp(`import ${CODE_BLOCK_NAME} from`, "g")),
    ];
    const codeBlocks = [
      ...value.matchAll(new RegExp(`jsx\\(${CODE_BLOCK_NAME},`, "g")),
    ];

    expect(importStatements).toHaveLength(1);
    expect(codeBlocks).toHaveLength(2);
  });

  it("should not process markdown files", () => {
    const markdown = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
    `;
    const vFile = new VFile({
      path: "file.md",
      value: markdown,
    });
    const result = compileSync(vFile, {
      rehypePlugins: [rehypeCodeBlocks],
    });

    const importStatements = [
      ...result.value
        .toString()
        .matchAll(new RegExp(`import ${CODE_BLOCK_NAME} from`, "g")),
    ];

    expect(importStatements).toHaveLength(0);
  });

  it("should handle unexpected node types in code block tree", () => {
    const mdx = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
    `;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });

    const result = compileSync(vFile, {
      rehypePlugins: [injectNonTextNode, rehypeCodeBlocks],
    });

    expect(result.value).toContain(`import ${CODE_BLOCK_NAME} from`);
    expect(result.value).toContain(CODE_BLOCK_PATH);
    expect(result.value).toMatch(`jsx(CodeBlock, {
    code: "console.log('Hello, world!');",
    lang: "js"
  })`);
  });

  it("should handle code block with non-code child element", () => {
    const mdx = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
    `;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });

    const modifyNodeStructure = () => (tree: Root) => {
      visit(tree, "element", (node) => {
        if (node.tagName === "pre") {
          // Replace the code child with a different element type
          node.children = [
            {
              type: "element",
              tagName: "span",
              children: [{ type: "text", value: "not a code element" }],
              properties: {},
            },
          ];
        }
      });
    };

    const result = compileSync(vFile, {
      rehypePlugins: [modifyNodeStructure, rehypeCodeBlocks],
    });

    expect(result.value).not.toContain(`import ${CODE_BLOCK_NAME} from`);
    expect(result.value).not.toMatch(`jsx(${CODE_BLOCK_NAME},`);
  });
});
