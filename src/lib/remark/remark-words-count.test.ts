import { remark } from "remark";
import { VFile } from "vfile";
import { afterAll, describe, expect, it, vi } from "vitest";
import { isObject } from "../../utils/type-checks";
import { remarkWordsCount } from "./remark-words-count";

vi.mock("../../utils/helpers/paths", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/paths")>();

  return {
    ...mod,
    getLocaleFromPath: vi.fn().mockImplementation((path: string) => {
      if (path.startsWith("/en/")) return "en";
      return "fr";
    }),
  };
});

describe("remark-words-count", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  it("adds the words count to Astro remarkPluginFrontmatter property", () => {
    const markdown = "Natus inventore eveniet est nulla veritatis aut.";
    const wordsInMarkdown = 7;
    const vFile = new VFile({
      data: { astro: { frontmatter: { wordsCount: undefined } } },
      path: "/en/file-path.md",
      value: markdown,
    });
    const result = remark().use(remarkWordsCount).processSync(vFile);

    if (
      !isObject(result.data.astro) ||
      !isObject(result.data.astro.frontmatter) ||
      !("wordsCount" in result.data.astro.frontmatter)
    ) {
      throw new Error("wordsCount property missing in astro frontmatter.");
    }

    expect(result.data.astro.frontmatter.wordsCount).toBe(wordsInMarkdown);
  });

  it("does not add the words count when Astro frontmatter does not exist", () => {
    const markdown = "Natus inventore eveniet est nulla veritatis aut.";
    const vFile = new VFile({
      data: {},
      path: "/en/file-path.md",
      value: markdown,
    });
    const result = remark().use(remarkWordsCount).processSync(vFile);

    expect(result.data.astro).not.toBeDefined();
  });

  it("can add the words count to Astro remarkPluginFrontmatter property for other languages", () => {
    const markdown = "Natus inventore eveniet est nulla veritatis aut.";
    const wordsInMarkdown = 7;
    const vFile = new VFile({
      data: { astro: { frontmatter: { wordsCount: undefined } } },
      path: "/fr/file-path.md",
      value: markdown,
    });
    const result = remark().use(remarkWordsCount).processSync(vFile);

    if (
      !isObject(result.data.astro) ||
      !isObject(result.data.astro.frontmatter) ||
      !("wordsCount" in result.data.astro.frontmatter)
    ) {
      throw new Error("wordsCount property missing in astro frontmatter.");
    }

    expect(result.data.astro.frontmatter.wordsCount).toBe(wordsInMarkdown);
  });
});
