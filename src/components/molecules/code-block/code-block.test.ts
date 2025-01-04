import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import CodeBlock from "./code-block.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("CodeBlock", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should display the given code wrapped in pre and code tags", async ({
    container,
  }) => {
    const props = {
      code: "console.log('Hello, world!');",
    } satisfies ComponentProps<typeof CodeBlock>;
    const result = await container.renderToString(CodeBlock, { props });

    expect.assertions(3);

    expect(result).toContain("</pre>");
    expect(result).toContain("</code>");
    expect(result).toContain(props.code);
  });

  it<LocalTestContext>("should display the given language", async ({
    container,
  }) => {
    const props = {
      code: "console.log('Hello, world!');",
      lang: "javascript",
    } satisfies ComponentProps<typeof CodeBlock>;
    const result = await container.renderToString(CodeBlock, { props });

    expect.assertions(1);

    expect(result).toContain(`${props.lang} </figcaption>`);
  });

  it<LocalTestContext>("should display the file path", async ({
    container,
  }) => {
    const props = {
      code: "console.log('Hello, world!');",
      filePath: "./hello-world.js",
      lang: "javascript",
    } satisfies ComponentProps<typeof CodeBlock>;
    const result = await container.renderToString(CodeBlock, { props });

    expect.assertions(1);

    expect(result).toContain(`${props.filePath} </figcaption>`);
  });

  describe("Options: Line numbers", () => {
    it<LocalTestContext>("should display the line numbers", async ({
      container,
    }) => {
      const props = {
        code: "console.log('Hello, world!');",
        showLineNumbers: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(2);

      expect(result).toContain('data-line-numbers="true"');
      expect(result).toContain(`--line-start: 1;`);
    });

    it<LocalTestContext>("should use the given number as a start point for the line numbers", async ({
      container,
    }) => {
      const props = {
        code: "console.log('Hello, world!');",
        lineStart: 42,
        showLineNumbers: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(1);

      expect(result).toContain(`--line-start: ${props.lineStart};`);
    });
  });

  describe("Options: Command line", () => {
    it<LocalTestContext>("should display a shell prompt with default user and host", async ({
      container,
    }) => {
      const props = {
        code: "cat ./hello-world.js",
        lang: "shell",
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(3);

      expect(result).toContain('data-prompt="true"');
      expect(result).toContain(`--prompt-host: &#34;localhost&#34;`);
      expect(result).toContain(`--prompt-user: &#34;user&#34;`);
    });

    it<LocalTestContext>("should display a shell prompt with a custom user", async ({
      container,
    }) => {
      const props = {
        code: "cat ./hello-world.js",
        lang: "shell",
        promptUser: "john",
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(2);

      expect(result).toContain(`--prompt-host: &#34;localhost&#34;`);
      expect(result).toContain(`--prompt-user: &#34;${props.promptUser}&#34;`);
    });

    it<LocalTestContext>("should display a shell prompt with a custom host", async ({
      container,
    }) => {
      const props = {
        code: "cat ./hello-world.js",
        lang: "shell",
        promptHost: "doe",
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(2);

      expect(result).toContain(`--prompt-host: &#34;${props.promptHost}&#34;`);
      expect(result).toContain(`--prompt-user: &#34;user&#34;`);
    });

    it<LocalTestContext>("should display a different shell prompt for root user", async ({
      container,
    }) => {
      const props = {
        code: "cat ./hello-world.js",
        lang: "shell",
        promptUser: "root",
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(2);

      expect(result).toContain("data-root");
      expect(result).toContain(`--prompt-user: &#34;${props.promptUser}&#34;`);
    });

    it<LocalTestContext>("should display an SQL prompt with default database", async ({
      container,
    }) => {
      const props = {
        code: "ALTER USER",
        lang: "sql",
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(4);

      expect(result).toContain('data-prompt="true"');
      expect(result).toContain(`--prompt-host: &#34;SQL&#34;`);
      expect(result).toContain(`--prompt-db: &#34;none&#34;`);
      expect(result).not.toContain("prompt-user");
    });

    it<LocalTestContext>("should display an SQL prompt with a custom database", async ({
      container,
    }) => {
      const props = {
        code: "ALTER USER",
        lang: "sql",
        promptDB: "user",
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(2);

      expect(result).toContain(`--prompt-host: &#34;SQL&#34;`);
      expect(result).toContain(`--prompt-db: &#34;${props.promptDB}&#34;`);
    });
  });

  describe("Options: isDiff", () => {
    it<LocalTestContext>("should handle diff code blocks", async ({
      container,
    }) => {
      const props = {
        code: `
-console.log('Hello, world!');
+console.log('Hello, John!')`,
        isDiff: true,
        showLineNumbers: true,
      } satisfies ComponentProps<typeof CodeBlock>;
      const result = await container.renderToString(CodeBlock, { props });

      expect.assertions(1);

      expect(result).toContain("data-diff");
    });
  });

  describe("Invalid options", () => {
    it<LocalTestContext>("should throw an error when showLineNumbers and showPrompt are used together", async ({
      container,
    }) => {
      const props = {
        code: "cat ./hello-world.js",
        lang: "shell",
        showLineNumbers: true,
        showPrompt: true,
      } satisfies ComponentProps<typeof CodeBlock>;

      expect.assertions(1);

      await expect(async () =>
        container.renderToString(CodeBlock, { props }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid properties: \`showLineNumbers\` and \`showPrompt\` can't be used together.]`,
      );
    });
  });
});
