import { compileSync } from "@mdx-js/mdx";
import { rehype } from "rehype";
import { VFile } from "vfile";
import { describe, expect, it } from "vitest";
import { rehypeImages } from "./rehype-images";

const createVFile = (
  content: string,
  options: {
    path?: string;
    imagePaths?: string[];
  } = {},
) => {
  const { path = "file.mdx", imagePaths = [] } = options;

  return new VFile({
    data: {
      astro: {
        imagePaths,
      },
    },
    path,
    value: content,
  });
};

describe("rehypeImages plugin", () => {
  describe("File Type Processing", () => {
    it("should not process non-MDX files", () => {
      const imgSrc = "./some-img.jpg";
      const html = `<html><body><a href="${imgSrc}"><img alt="" src="${imgSrc}" /></a></body></html>`;
      const result = rehype().use(rehypeImages).processSync({
        value: html,
      });

      expect(result.value).toMatchInlineSnapshot(
        `"<html><head></head><body><a href="./some-img.jpg"><img alt="" src="./some-img.jpg"></a></body></html>"`,
      );
    });
  });

  describe("Image Wrapping and Unwrapping", () => {
    it("should unwrap linked images with HTML tags in MDX when link matches image source", () => {
      const imgSrc = "./some-img.jpg";
      const mdx = `<a href="${imgSrc}"><img alt="Test" src="${imgSrc}" /></a>`;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).not.toContain('_jsx("a"');
      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
      expect(result.value).toContain('"data-clickable": "true"');
    });

    it("should unwrap linked images with Markdown syntax when link matches image source", () => {
      const imgSrc = "./some-img.jpg";
      const mdx = `[![alt txt](${imgSrc})](${imgSrc})`;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).not.toContain('_jsx("a"');
      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
      expect(result.value).toContain('"data-clickable": "true"');
    });

    it("should preserve links that do not target the image source", () => {
      const link = "https://example.test";
      const imgSrc = "./some-img.jpg";
      const mdx = `<a href="${link}"><img alt="" src="${imgSrc}" /></a>`;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).toContain('_jsx("a"');
      expect(result.value).toContain(link);
      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
      expect(result.value).not.toContain('"data-clickable": "true"');
    });

    it("should preserve links with non-string link targets", () => {
      const imgSrc = "./some-img.jpg";
      const mdx = `<a href={dynamicLink}><img src="${imgSrc}" /></a>`;
      const vFile = new VFile({
        path: "file.mdx",
        value: mdx,
      });

      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).toContain('_jsx("a"');
      expect(result.value).toContain(imgSrc);
    });
  });

  describe("Remote Image Handling", () => {
    it("should add inferSize for remote images without width/height", () => {
      const imgSrc = "https://example.com/image.jpg";
      const mdx = `<img alt="" src="${imgSrc}" />`;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
      expect(result.value).toContain("inferSize: true");
    });

    it("should not add inferSize for remote images with width and height", () => {
      const imgSrc = "https://example.com/image.jpg";
      const mdx = `<img alt="" src="${imgSrc}" width="640" height="480" />`;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
      expect(result.value).not.toContain("inferSize: true");
    });

    it("should not add inferSize for local relative images", () => {
      const imgSrc = "./local-image.jpg";
      const mdx = `<img alt="" src="${imgSrc}" />`;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
      expect(result.value).not.toContain("inferSize: true");
    });
  });

  describe("Image Path Collection", () => {
    it("should add local relative image paths to vFile data", () => {
      const imgSrc = "./some-img.jpg";
      const mdx = `<img alt="" src="${imgSrc}" />`;
      const vFile = createVFile(mdx, { imagePaths: [] });
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.data.astro?.imagePaths?.includes(imgSrc)).toBe(true);
    });

    it("should not add absolute path to image paths", () => {
      const imgSrc = "/absolute/path/image.jpg";
      const mdx = `<img alt="" src="${imgSrc}" />`;
      const vFile = new VFile({
        data: {
          astro: {
            imagePaths: [],
          },
        },
        path: "file.mdx",
        value: mdx,
      });

      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.data.astro?.imagePaths?.includes(imgSrc)).toBe(false);
    });

    it("should not add remove images to image paths", () => {
      const imgSrc = "https://example.com/image.jpg";
      const mdx = `<img alt="" src="${imgSrc}" />`;
      const vFile = new VFile({
        data: {
          astro: {
            imagePaths: [],
          },
        },
        path: "file.mdx",
        value: mdx,
      });

      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.data.astro?.imagePaths?.includes(imgSrc)).toBe(false);
    });
  });

  describe("MDX and HTML Image Processing", () => {
    it("should handle both MDX and HTML image elements", () => {
      const imgSrc = "./some-img.jpg";
      const mdx = `
        <img alt="HTML style" src="${imgSrc}" />
        {/* Some content */}
        <mdx.img alt="MDX style" src="${imgSrc}" />
      `;
      const vFile = createVFile(mdx);
      const result = compileSync(vFile, {
        rehypePlugins: [rehypeImages],
      });

      expect(result.value).toContain("_jsx(_components.img");
      expect(result.value).toContain(imgSrc);
    });
  });
});
