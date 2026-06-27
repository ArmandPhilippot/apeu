import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { hastInferRemoteImagesSize } from "./hast-infer-remote-images-size";

const OPTIONS: MdxCompileOptions = {
  hastPlugins: [hastInferRemoteImagesSize],
};

const compileMdx = (source: string) => mdxToJs(source, OPTIONS);

describe("hast-infer-remote-images-size", () => {
  it("should add inferSize property to remote images written with Markdown syntax", () => {
    const src = "https://example.test/my-image.jpg";
    const result = compileMdx(`![Example](${src})`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).toContain("inferSize: true");
  });

  it("should not add inferSize property to local images written with Markdown syntax", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(`![Example](${src})`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain("inferSize: true");
  });

  it("should not add inferSize property to remote images written with HTML syntax", () => {
    const src = "https://example.test/my-image.jpg";
    const result = compileMdx(`<img alt="Example" src="${src}" />`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain("inferSize: true");
  });

  it("should not add inferSize property to local images written with HTML syntax", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(`<img alt="Example" src="${src}" />`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain("inferSize: true");
  });

  it("should not add inferSize property to non-image elements", () => {
    const href = "https://example.test";
    const result = compileMdx(`<a href="${href}">Read more</a>`);

    expect(result.code).toContain(`href: "${href}"`);
    expect(result.code).toContain('"Read more"');
    expect(result.code).not.toContain("inferSize: true");
  });
});
