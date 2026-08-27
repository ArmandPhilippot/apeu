import { pathToFileURL } from "node:url";
import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import {
  CODE_BLOCK_NAME,
  CODE_BLOCK_PATH,
  mdastCodeBlocks,
} from "./mdast-code-blocks";

const MDX_FILE_URL = pathToFileURL("/fake/document.mdx");
const MD_FILE_URL = pathToFileURL("/fake/document.md");

const OPTIONS: MdxCompileOptions = {
  mdastPlugins: [mdastCodeBlocks],
};

describe("mdast-code-blocks", () => {
  describe("MDX file processing", () => {
    it("should replace a fenced code block with the CodeBlock component", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain(CODE_BLOCK_NAME);
    });

    it("should inject an import statement for the CodeBlock component", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const mdx = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain(`import ${CODE_BLOCK_NAME} from`);
      expect(result.code).toContain(CODE_BLOCK_PATH);
    });

    it("should forward the language as a `lang` prop", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`typescript
const x: number = 42;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('lang: "typescript"');
    });

    it("should use an empty string for `lang` when no language is specified", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`
plain text
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('lang: ""');
    });

    it("should forward the code content as a `code` prop", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js
const answer = 42;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('"const answer = 42;"');
    });

    it("should preserve multi-line code content", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const mdx = `
\`\`\`js
const a = 1;
const b = 2;
const c = a + b;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain("const a = 1;");
      expect(result.code).toContain("const b = 2;");
      expect(result.code).toContain("const c = a + b;");
    });
  });

  describe("meta string parsing", () => {
    it("should convert a boolean meta prop into a `true` JSX prop", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js showLineNumbers
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain("showLineNumbers: true");
    });

    it("should strip double quotes from a string meta prop value", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js filePath="./hello-world.js"
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('filePath: "./hello-world.js"');
    });

    it("should strip single quotes from a string meta prop value", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js filePath='./hello-world.js'
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('filePath: "./hello-world.js"');
    });

    it("should pass a bare string meta prop value as-is", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js filePath=./hello-world.js
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('filePath: "./hello-world.js"');
    });

    it("should evaluate a `{number}` expression meta prop as a number", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js lineStart={1500}
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain("lineStart: 1500");
    });

    it("should evaluate a `{boolean}` expression meta prop as a boolean", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js showLineNumbers={true}
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain("showLineNumbers: true");
    });

    it("should handle multiple meta props at once", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const mdx = `
\`\`\`js showLineNumbers filePath="./hello-world.js" lineStart={1500}
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain("showLineNumbers: true");
      expect(result.code).toContain('filePath: "./hello-world.js"');
      expect(result.code).toContain("lineStart: 1500");
    });

    it("should not split a quoted value that contains spaces", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js caption="Hello, world!"
const x = 1;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });

      expect(result.code).toContain('caption: "Hello, world!"');
    });
  });

  describe("import deduplication", () => {
    it("should inject only one import statement when the file contains multiple code blocks", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js
const a = 1;
\`\`\`

\`\`\`ts
const b = 2;
\`\`\`

\`\`\`shell
echo "done"
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });
      const importMatches = [
        ...result.code.matchAll(
          new RegExp(`import ${CODE_BLOCK_NAME} from`, "g")
        ),
      ];

      expect(importMatches).toHaveLength(1);
    });

    it("should replace every code block in the file", async () => {
      expect.assertions(1);

      const mdx = `
\`\`\`js
const a = 1;
\`\`\`

\`\`\`ts
const b = 2;
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MDX_FILE_URL });
      const componentMatches = [
        ...result.code.matchAll(new RegExp(`${CODE_BLOCK_NAME},`, "g")),
      ];

      /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
      expect(componentMatches).toHaveLength(2);
    });
  });

  describe("non-MDX files", () => {
    it("should not transform code blocks in non-MDX files", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(2);

      const mdx = `
\`\`\`js
console.log('Hello, world!');
\`\`\`
`;
      const result = await mdxToJs(mdx, { ...OPTIONS, fileURL: MD_FILE_URL });

      expect(result.code).not.toContain(CODE_BLOCK_NAME);
      expect(result.code).not.toContain(`import ${CODE_BLOCK_NAME} from`);
    });
  });
});
