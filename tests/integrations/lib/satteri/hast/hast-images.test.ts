import { mdxToJs } from "satteri";
import { describe, expect, it } from "vitest";
import { hastHtmlImages } from "../../../../../src/lib/satteri/hast/hast-html-images";
import { hastLinkedImages } from "../../../../../src/lib/satteri/hast/hast-linked-images";

// Order matters: hastHtmlImages must run first so the inner <img> is converted
// from mdxJsxFlowElement to element before hastLinkedImages visits the <a>.
const compileMdx = (source: string) =>
  mdxToJs(source, { hastPlugins: [hastHtmlImages, hastLinkedImages] });

describe("hast-html-images + hast-linked-images", () => {
  describe("HTML linked images", () => {
    it('should unwrap <a href="X"><img src="X" /></a> when href matches src', () => {
      const src = "./my-image.jpg";
      const result = compileMdx(
        `<a href="${src}"><img alt="Example" src="${src}" /></a>`
      );

      expect(result.code).not.toContain(`href: "${src}"`);
      expect(result.code).toContain(`src: "${src}"`);
      expect(result.code).toContain('"data-clickable": true');
    });

    it("should preserve alt and src when unwrapping HTML links", () => {
      const src = "./my-image.jpg";
      const result = compileMdx(
        `<a href="${src}"><img alt="A clickable image" src="${src}" /></a>`
      );

      expect(result.code).toContain('"data-clickable": true');
      expect(result.code).toContain('alt: "A clickable image"');
      expect(result.code).toContain(`src: "${src}"`);
    });

    it("should keep HTML links when href does not match image src", () => {
      const imgSrc = "./my-image.jpg";
      const href = "./other-page";
      const result = compileMdx(
        `<a href="${href}"><img alt="Example" src="${imgSrc}" /></a>`
      );

      expect(result.code).toContain(`href: "${href}"`);
      expect(result.code).toContain(`src: "${imgSrc}"`);
      expect(result.code).not.toContain('"data-clickable": true');
    });

    it("should not unwrap HTML links with multiple children", () => {
      const src = "./my-image.jpg";
      const result = compileMdx(
        `<a href="${src}"><img alt="Example" src="${src}" /><span>Caption</span></a>`
      );

      expect(result.code).toContain(`href: "${src}"`);
      expect(result.code).toContain('"Caption"');
      expect(result.code).not.toContain('"data-clickable": true');
    });

    it("should not unwrap HTML links wrapping a remote image", () => {
      // Remote images are not converted by hastHtmlImages — they remain
      // mdxJsxFlowElement — so the child.type !== "element" guard fires and
      // the anchor is left untouched.
      const src = "https://example.test/my-image.jpg";
      const result = compileMdx(
        `<a href="${src}"><img alt="Example" src="${src}" /></a>`
      );

      expect(result.code).toContain(`href: "${src}"`);
      expect(result.code).not.toContain('"data-clickable": true');
    });
  });
});
