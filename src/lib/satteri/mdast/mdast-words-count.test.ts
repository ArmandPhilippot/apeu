import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { mdastWordsCount } from "./mdast-words-count";

const OPTIONS: MdxCompileOptions = {
  mdastPlugins: [mdastWordsCount],
  features: { directive: true },
};

describe("mdast-words-count", () => {
  it("should add the words count to the frontmatter", async () => {
    expect.assertions(1);

    const mdx = `Natus inventore eveniet est nulla veritatis aut.`;
    const wordsInMarkdown = 7;
    const result = await mdxToJs(mdx, {
      ...OPTIONS,
      data: {
        astro: {
          headings: [],
          localImagePaths: new Set(),
          remoteImagePaths: new Set(),
          frontmatter: { wordsCount: undefined },
        },
      },
    });

    expect(result.data.astro?.frontmatter.wordsCount).toBe(wordsInMarkdown);
  });

  it("should count words inside HTML tags", async () => {
    expect.assertions(1);

    const mdx = `Some words before.\n\n<div>some words inside div</div>\n\nMore words after.\n`;
    const wordsInMarkdown = 10;
    const result = await mdxToJs(mdx, {
      ...OPTIONS,
      data: {
        astro: {
          headings: [],
          localImagePaths: new Set(),
          remoteImagePaths: new Set(),
          frontmatter: { wordsCount: undefined },
        },
      },
    });

    expect(result.data.astro?.frontmatter.wordsCount).toBe(wordsInMarkdown);
  });

  it("should not add the words count when frontmatter does not exist", async () => {
    expect.assertions(1);

    const mdx = `
Natus inventore eveniet est nulla veritatis aut.
`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.data.astro).not.toBeDefined();
  });
});
