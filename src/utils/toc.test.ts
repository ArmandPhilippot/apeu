import type { MarkdownHeading } from "astro";
import { describe, expect, it } from "vitest";
import { buildToc } from "./toc";

describe("build-toc", () => {
  it("can build a table of contents from markdown headings", () => {
    const markdownHeadings = [
      { depth: 2, slug: "first-heading", text: "First heading" },
      { depth: 2, slug: "second-heading", text: "Second heading" },
      { depth: 3, slug: "first-subheading", text: "First subheading" },
      { depth: 3, slug: "second-subheading", text: "Second subheading" },
      { depth: 2, slug: "third-heading", text: "Third heading" },
    ] as const satisfies MarkdownHeading[];
    const toc = buildToc(markdownHeadings);

    // We have 3 headings of level 2 so the length should be 3.
    expect(toc.length).toBe(3);
    expect(toc[0]?.label).toBe(markdownHeadings[0].text);
    // The second heading is followed by two headings of level 3.
    expect(toc[1]?.label).toBe(markdownHeadings[1].text);
    expect(toc[1]?.children?.length).toBe(2);
    expect(toc[2]?.label).toBe(markdownHeadings[4].text);
  });
});
