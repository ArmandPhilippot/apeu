import type { SatteriAstroData } from "@astrojs/markdown-satteri";
import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { hastHtmlImages } from "./hast-html-images";

const createAstroData = (): SatteriAstroData => {
  return {
    frontmatter: {},
    headings: [],
    localImagePaths: new Set(),
    remoteImagePaths: new Set(),
  };
};

const compileMdx = (source: string, options: MdxCompileOptions = {}) =>
  mdxToJs(source, { hastPlugins: [hastHtmlImages()], ...options });

describe("hast-html-images", () => {
  describe("Block-level (flow) HTML img", () => {
    it("should preserve all string attributes when converting to a HAST element", () => {
      const result = compileMdx(
        `<img alt="Example" src="./img.jpg" width="640" height="480" />`
      );

      expect(result.code).toContain('alt: "Example"');
      expect(result.code).toContain('src: "./img.jpg"');
      expect(result.code).toContain('width: "640"');
      expect(result.code).toContain('height: "480"');
    });

    it("should drop JSX expression attribute values (non-string src)", () => {
      const result = compileMdx(`<img alt="Example" src={dynamicSrc} />`);

      expect(result.code).toContain('alt: "Example"');
      expect(result.code).not.toContain("dynamicSrc");
    });

    it("should drop spread expression attributes", () => {
      const result = compileMdx(`<img alt="Example" {...imgProps} />`);

      expect(result.code).toContain('alt: "Example"');
      expect(result.code).not.toContain("imgProps");
    });
  });

  describe("Inline (text) HTML img", () => {
    it("should preserve string attributes for an inline img", () => {
      const result = compileMdx(
        `Some text with an <img alt="Inline" src="./inline.jpg" /> image.`
      );

      expect(result.code).toContain('alt: "Inline"');
      expect(result.code).toContain('src: "./inline.jpg"');
    });
  });

  describe("localImagePaths registration", () => {
    it("should register a relative src starting with ./", () => {
      const src = "./my-image.jpg";
      const astro = createAstroData();
      compileMdx(`<img alt="Example" src="${src}" />`, { data: { astro } });

      expect(astro.localImagePaths.has(src)).toBe(true);
    });

    it("should register a relative src starting with ../", () => {
      const src = "../assets/my-image.jpg";
      const astro = createAstroData();
      compileMdx(`<img alt="Example" src="${src}" />`, { data: { astro } });

      expect(astro.localImagePaths.has(src)).toBe(true);
    });

    it("should register a relative src without a path prefix", () => {
      const src = "my-image.jpg";
      const astro = createAstroData();
      compileMdx(`<img alt="Example" src="${src}" />`, { data: { astro } });

      expect(astro.localImagePaths.has(src)).toBe(true);
    });

    it("should not register an absolute path", () => {
      const src = "/assets/my-image.jpg";
      const astro = createAstroData();
      compileMdx(`<img alt="Example" src="${src}" />`, { data: { astro } });

      expect(astro.localImagePaths.has(src)).toBe(false);
    });

    it("should not register a remote URL", () => {
      const src = "https://example.test/my-image.jpg";
      const astro = createAstroData();
      compileMdx(`<img alt="Example" src="${src}" />`, { data: { astro } });

      expect(astro.localImagePaths.has(src)).toBe(false);
    });

    it("should not register when there is no src attribute", () => {
      const astro = createAstroData();
      compileMdx(`<img alt="decorative" />`, { data: { astro } });

      expect(astro.localImagePaths.size).toBe(0);
    });

    it("should decode a percent-encoded src before registering", () => {
      const encodedSrc = "./path/my%20image.jpg";
      const decodedSrc = "./path/my image.jpg";
      const astro = createAstroData();
      compileMdx(`<img alt="Example" src="${encodedSrc}" />`, {
        data: { astro },
      });

      expect(astro.localImagePaths.has(decodedSrc)).toBe(true);
      expect(astro.localImagePaths.has(encodedSrc)).toBe(false);
    });

    it("should register all distinct local images in a document", () => {
      const src1 = "./img1.jpg";
      const src2 = "./img2.png";
      const astro = createAstroData();
      compileMdx(`<img src="${src1}" /><img src="${src2}" />`, {
        data: { astro },
      });

      expect(astro.localImagePaths.has(src1)).toBe(true);
      expect(astro.localImagePaths.has(src2)).toBe(true);
    });

    it("should deduplicate repeated uses of the same src", () => {
      const src = "./img.jpg";
      const astro = createAstroData();
      compileMdx(`<img src="${src}" /><img src="${src}" />`, {
        data: { astro },
      });

      expect(astro.localImagePaths.size).toBe(1);
    });

    it("should register a local src from an inline img", () => {
      const src = "./inline.jpg";
      const astro = createAstroData();
      compileMdx(`Some text with <img alt="Example" src="${src}" /> content.`, {
        data: { astro },
      });

      expect(astro.localImagePaths.has(src)).toBe(true);
    });
  });

  describe("Local and allowed-remote images are converted", () => {
    it("should convert a local relative src to an element node", () => {
      const src = "./my-image.jpg";
      const result = compileMdx(`<img alt="Example" src="${src}" />`);

      expect(result.code).toContain("_components.img");
      expect(result.code).not.toContain(`_jsx("img"`);
    });

    it("should convert and register a remote src whose domain is allowed", () => {
      const src = "https://example.test/my-image.jpg";
      const astro = createAstroData();
      const result = compileMdx(`<img alt="Example" src="${src}" />`, {
        data: { astro },
        hastPlugins: [hastHtmlImages({ domains: ["example.test"] })],
      });

      expect(result.code).toContain("_components.img");
      expect(result.code).not.toContain(`_jsx("img"`);
      expect(astro.remoteImagePaths.has(src)).toBe(true);
    });
  });

  describe("Disallowed-remote and absolute images are not converted", () => {
    it("should not convert a remote URL src whose domain is not allowed", () => {
      // Left as mdxJsxFlowElement so the MDX compiler emits a literal
      // _jsx("img", ...) instead of routing it through _components.img,
      // which would otherwise reach Astro's image pipeline and fail.
      const src = "https://example.test/my-image.jpg";
      const astro = createAstroData();
      const result = compileMdx(`<img alt="Example" src="${src}" />`, {
        data: { astro },
      });

      expect(result.code).toContain(`_jsx("img"`);
      expect(result.code).not.toContain("_components.img");
      expect(astro.remoteImagePaths.has(src)).toBe(false);
    });

    it("should not convert an absolute path src to an element node", () => {
      const src = "/assets/my-image.jpg";
      const result = compileMdx(`<img alt="Example" src="${src}" />`);

      expect(result.code).toContain(`_jsx("img"`);
      expect(result.code).not.toContain("_components.img");
    });
  });

  describe("Non-img elements are unaffected", () => {
    it("should not register src for a non-img HTML element", () => {
      const src = "./img.jpg";
      const astro = createAstroData();
      compileMdx(`<a href="${src}">Link</a>`, { data: { astro } });

      expect(astro.localImagePaths.size).toBe(0);
    });

    it("should preserve non-img element attributes unchanged", () => {
      const href = "https://example.test";
      const result = compileMdx(`<a href="${href}">Read more</a>`);

      expect(result.code).toContain(`href: "${href}"`);
      expect(result.code).toContain('"Read more"');
    });
  });

  describe("Markdown syntax images are not double-processed", () => {
    it("should not affect images written with Markdown syntax", () => {
      const src = "./md-image.jpg";
      const astro = createAstroData();
      const result = compileMdx(`![alt text](${src})`, { data: { astro } });

      // Markdown images become HAST element img at the mdast→hast boundary,
      // before any HAST plugin runs. Our plugin only touches mdxJsxFlowElement
      // and mdxJsxTextElement, so the src should still appear in the output.
      expect(result.code).toContain(`src: "${src}"`);
      // LocalImagePaths is not populated here: that is the responsibility of
      // createCollectImagesPlugin (the MDAST-stage collector in
      // @astrojs/markdown-satteri), which is not part of this test pipeline.
      expect(astro.localImagePaths.size).toBe(0);
    });
  });
});
