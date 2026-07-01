import type { SatteriAstroData } from "@astrojs/markdown-satteri";
import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { hastMdxHtmlSyntax } from "./hast-mdx-html-syntax";

const createAstroData = (): SatteriAstroData => {
  return {
    frontmatter: {},
    headings: [],
    localImagePaths: new Set(),
    remoteImagePaths: new Set(),
  };
};

const compileMdx = async (source: string, options: MdxCompileOptions = {}) =>
  mdxToJs(source, { hastPlugins: [hastMdxHtmlSyntax], ...options });

describe("hast-mdx-html-syntax", () => {
  it("should convert standard HTML elements to HAST elements", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const result = await compileMdx(`<div className="card">Example</div>`);

    expect(result.code).toContain("_components.div");
    expect(result.code).not.toContain(`_jsx("div"`);
  });

  it("should handle inline HTML elements correctly", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const result = await compileMdx(
      `Some text with an <a href="/x">inline link</a>.`
    );

    expect(result.code).toContain("_components.a");
    expect(result.code).not.toContain(`_jsx("a"`);
  });

  it("should convert value-less attributes to boolean true", async () => {
    expect.assertions(1);

    const result = await compileMdx(`<button disabled>Click me</button>`);

    expect(result.code).toContain("disabled: true");
  });

  it("should drop JSX expression attribute values", async () => {
    expect.assertions(1);

    const result = await compileMdx(`<div data-x={dynamicValue}>Example</div>`);

    expect(result.code).not.toContain("dynamicValue");
  });

  it("should drop spread expression attributes", async () => {
    expect.assertions(1);

    const result = await compileMdx(`<div {...divProps}>Example</div>`);

    expect(result.code).not.toContain("divProps");
  });

  it("should register relative image sources in Astro context", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const astro = createAstroData();
    await compileMdx(`<img src="./image.jpg" />`, { data: { astro } });

    expect(astro.localImagePaths.has("./image.jpg")).toBe(true);
    expect(astro.remoteImagePaths.size).toBe(0);
  });

  it("should register remote image sources in Astro context", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const astro = createAstroData();
    await compileMdx(`<img src="https://example.com/image.jpg" />`, {
      data: { astro },
    });

    expect(astro.remoteImagePaths.has("https://example.com/image.jpg")).toBe(
      true
    );
    expect(astro.localImagePaths.size).toBe(0);
  });
});
