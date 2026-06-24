import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { hastLinkedImages } from "./hast-linked-images";

const OPTIONS: MdxCompileOptions = {
  hastPlugins: [hastLinkedImages],
};

const compileMdx = (source: string) => mdxToJs(source, OPTIONS);

describe("hast-linked-images", () => {
  it("should unwrap linked images written with markdown syntax when href matches src", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(`[![example alt](${src})](${src})`);

    expect(result.code).not.toContain(`href: "${src}"`);
    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).toContain('"data-clickable": true');
  });

  it("should preserve alt and src when unwrapping markdown links", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(`[![Example](${src})](${src})`);

    expect(result.code).toContain('"data-clickable": true');
    expect(result.code).toContain('alt: "Example"');
    expect(result.code).toContain('src: "./my-image.jpg"');
  });

  it("should keep links when href does not match image src", () => {
    const imgSrc = "./my-image.jpg";
    const href = "https://example.test/article";
    const result = compileMdx(`[![Example](${imgSrc})](${href})`);

    expect(result.code).toContain(`href: "${href}"`);
    expect(result.code).toContain(`src: "${imgSrc}"`);
    expect(result.code).not.toContain('"data-clickable": true');
  });

  it("should keep links that do not contain images", () => {
    const href = "https://example.test";
    const result = compileMdx(`<a href="${href}">Read more</a>`);

    expect(result.code).toContain(`href: "${href}"`);
    expect(result.code).toContain('"Read more"');
    expect(result.code).not.toContain('"data-clickable": true');
  });

  it("should not transform standalone images", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(`<img alt="Example" src="${src}" />`);

    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain('"data-clickable": true');
  });

  it("should not process JSX links, even when href matches src", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(
      `<a href="${src}"><img alt="Example" src="${src}" /></a>`
    );

    expect(result.code).toContain(`href: "${src}"`);
    expect(result.code).toContain(`src: "${src}"`);
    expect(result.code).not.toContain('"data-clickable": true');
  });

  it("should not unwrap markdown links that contain a JSX image component", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(`[<img alt="Example" src="${src}" />](${src})`);

    expect(result.code).toContain(`href: "${src}"`);
    expect(result.code).not.toContain('"data-clickable": true');
  });

  it("should not process JSX links with mixed children", () => {
    const src = "./my-image.jpg";
    const result = compileMdx(
      `<a href="${src}"><img alt="Example" src="${src}" /><span>Caption</span></a>`
    );

    expect(result.code).toContain(`href: "${src}"`);
    expect(result.code).toContain('"Caption"');
    expect(result.code).not.toContain('"data-clickable": true');
  });
});
