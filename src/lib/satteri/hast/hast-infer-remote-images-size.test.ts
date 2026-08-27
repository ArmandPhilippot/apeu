import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { hastInferRemoteImagesSize } from "./hast-infer-remote-images-size";

const OPTIONS: MdxCompileOptions = {
  hastPlugins: [hastInferRemoteImagesSize],
};

const compileMdx = async (source: string) => mdxToJs(source, OPTIONS);

describe("hast-infer-remote-images-size", () => {
  it("should add inferSize property to remote images written with Markdown syntax", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const src = "https://example.test/my-image.jpg";
    const result = await compileMdx(`![Example](${src})`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).toContain("inferSize: true");
  });

  it("should not add inferSize property to local images written with Markdown syntax", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const src = "./my-image.jpg";
    const result = await compileMdx(`![Example](${src})`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain("inferSize: true");
  });

  it("should not add inferSize property to remote images written with HTML syntax", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const src = "https://example.test/my-image.jpg";
    const result = await compileMdx(`<img alt="Example" src="${src}" />`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain("inferSize: true");
  });

  it("should not add inferSize property to local images written with HTML syntax", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const src = "./my-image.jpg";
    const result = await compileMdx(`<img alt="Example" src="${src}" />`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain("inferSize: true");
  });

  it("should not add inferSize property to non-image elements", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const href = "https://example.test";
    const result = await compileMdx(`<a href="${href}">Read more</a>`);

    expect(result.code).toContain(`href: "${href}"`);
    expect(result.code).toContain('"Read more"');
    expect(result.code).not.toContain("inferSize: true");
  });
});
