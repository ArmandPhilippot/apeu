import { mdxToJs } from "satteri";
import { describe, expect, it } from "vitest";
import { hastLinkedImages } from "../../../../../src/lib/satteri/hast/hast-linked-images";
import { hastMdxHtmlSyntax } from "../../../../../src/lib/satteri/hast/hast-mdx-html-syntax";

// Order matters: hastMdxHtmlSyntax must run first so the inner <img> is converted
// from mdxJsxFlowElement to element before hastLinkedImages visits the <a>.
const compileMdx = async (source: string) =>
  mdxToJs(source, { hastPlugins: [hastMdxHtmlSyntax, hastLinkedImages] });

describe("hast-mdx-html-syntax + hast-linked-images", () => {
  describe("HTML linked images", () => {
    it('should unwrap <a href="X"><img src="X" /></a> when href matches src', async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const src = "./my-image.jpg";
      const result = await compileMdx(
        `<a href="${src}"><img alt="Example" src="${src}" /></a>`
      );

      expect(result.code).not.toContain(`href: "${src}"`);
      expect(result.code).toContain(`src: "${src}"`);
      expect(result.code).toContain('"data-clickable": true');
    });

    it("should preserve alt and src when unwrapping HTML links", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const src = "./my-image.jpg";
      const result = await compileMdx(
        `<a href="${src}"><img alt="A clickable image" src="${src}" /></a>`
      );

      expect(result.code).toContain('"data-clickable": true');
      expect(result.code).toContain('alt: "A clickable image"');
      expect(result.code).toContain(`src: "${src}"`);
    });

    it("should keep HTML links when href does not match image src", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const imgSrc = "./my-image.jpg";
      const href = "./other-page";
      const result = await compileMdx(
        `<a href="${href}"><img alt="Example" src="${imgSrc}" /></a>`
      );

      expect(result.code).toContain(`href: "${href}"`);
      expect(result.code).toContain(`src: "${imgSrc}"`);
      expect(result.code).not.toContain('"data-clickable": true');
    });

    it("should not unwrap HTML links with multiple children", async () => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
      expect.assertions(3);

      const src = "./my-image.jpg";
      const result = await compileMdx(
        `<a href="${src}"><img alt="Example" src="${src}" /><span>Caption</span></a>`
      );

      expect(result.code).toContain(`href: "${src}"`);
      expect(result.code).toContain('"Caption"');
      expect(result.code).not.toContain('"data-clickable": true');
    });
  });
});
