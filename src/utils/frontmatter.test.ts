import { describe, expect, it } from "vitest";
import { getMetaFromRemarkPluginFrontmatter } from "./frontmatter";

describe("get-meta-from-remark-plugin-frontmatter", () => {
  it("can return the reading time if wordsCount is defined", () => {
    const remarkPluginFrontmatter = {
      wordsCount: 324,
    };
    const result = getMetaFromRemarkPluginFrontmatter(
      remarkPluginFrontmatter,
      "en"
    );

    expect(result.readingTime).toBeDefined();
    expect(result.readingTime?.wordsCount).toBe(
      remarkPluginFrontmatter.wordsCount
    );
  });

  it("does not return the reading time when wordsCount is undefined", () => {
    const remarkPluginFrontmatter = {};
    const result = getMetaFromRemarkPluginFrontmatter(
      remarkPluginFrontmatter,
      "en"
    );

    expect(result.readingTime).not.toBeDefined();
  });
});
