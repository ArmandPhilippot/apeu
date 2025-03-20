import { compileSync } from "@mdx-js/mdx";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";
import { remarkCallouts } from "./remark-callouts";

describe("remark-callouts", () => {
  it("should transform a directive into a callout element", () => {
    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      remarkPlugins: [remarkDirective, remarkCallouts],
    });

    expect(result.value).toContain('callout: "callout"');
    expect(result.value).toContain(
      'children: "Natus inventore eveniet est nulla veritatis aut."'
    );
  });

  it("should not transform an unknown directive", () => {
    const mdx = `
:::unsupported
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      remarkPlugins: [remarkDirective, remarkCallouts],
    });

    expect(result.value).not.toContain('callout: "callout"');
    expect(result.value).toContain(
      'children: "Natus inventore eveniet est nulla veritatis aut."'
    );
  });

  it("should support titles in plain text", () => {
    const mdx = `
:::warning[A custom title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      remarkPlugins: [remarkDirective, remarkCallouts],
    });

    expect(result.value).toContain('label: "A custom title"');
    expect(result.value).toContain(
      'children: "Natus inventore eveniet est nulla veritatis aut."'
    );
  });

  it("should handle titles written with Markdown", () => {
    const mdx = `
:::warning[A **custom** title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      remarkPlugins: [remarkDirective, remarkCallouts],
    });

    expect(result.value).toContain('label: "A custom title"');
    expect(result.value).toContain(
      'children: "Natus inventore eveniet est nulla veritatis aut."'
    );
  });

  it("should forward the attributes", () => {
    const mdx = `
:::warning{role="alert"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const vFile = new VFile({
      path: "file.mdx",
      value: mdx,
    });
    const result = compileSync(vFile, {
      remarkPlugins: [remarkDirective, remarkCallouts],
    });

    expect(result.value).toContain('role: "alert"');
  });

  it("should not process Markdown files", () => {
    const markdown = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const vFile = new VFile({
      data: { astro: { frontmatter: { wordsCount: undefined } } },
      path: "/en/file-path.md",
      value: markdown,
    });
    const result = remark()
      .use(remarkDirective)
      .use(remarkCallouts)
      .processSync(vFile);

    expect(result.value).not.toContain("callout");
    expect(result.value).toContain(markdown.trim());
  });
});
