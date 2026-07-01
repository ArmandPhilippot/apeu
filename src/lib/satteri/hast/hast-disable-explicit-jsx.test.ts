import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { hastDisableExplicitJsx } from "./hast-disable-explicit-jsx";

const OPTIONS: MdxCompileOptions = {
  hastPlugins: [hastDisableExplicitJsx],
};

const compileMdx = (source: string) => mdxToJs(source, OPTIONS);

describe("hast-disable-explicit-jsx", () => {
  describe("Block-level (flow) JSX tags", () => {
    it("should route a standalone JSX tag through the components mapping", () => {
      const result = compileMdx(`<div>Example</div>`);

      expect(result.code).toContain("_components.div");
      expect(result.code).not.toContain(`_jsx("div"`);
    });

    it("should route every JSX tag in a document independently", () => {
      const result = compileMdx(`<div>A</div>\n\n<figure>B</figure>`);

      expect(result.code).toContain("_components.div");
      expect(result.code).toContain("_components.figure");
    });
  });

  describe("Inline (text) JSX tags", () => {
    it("should route an inline JSX tag through the components mapping", () => {
      const result = compileMdx(`Some text with an <a href="/x">inline link</a>.`);

      expect(result.code).toContain("_components.a");
      expect(result.code).not.toContain(`_jsx("a"`);
    });
  });

  describe("Attributes", () => {
    it("should preserve string attributes", () => {
      const result = compileMdx(`<div className="card" id="main">Example</div>`);

      expect(result.code).toContain('className: "card"');
      expect(result.code).toContain('id: "main"');
    });

    it("should convert a value-less attribute to boolean true", () => {
      const result = compileMdx(`<button disabled>Example</button>`);

      expect(result.code).toContain("disabled: true");
    });

    it("should drop JSX expression attribute values", () => {
      const result = compileMdx(`<div data-x={dynamicValue}>Example</div>`);

      expect(result.code).not.toContain("dynamicValue");
    });

    it("should drop spread expression attributes", () => {
      const result = compileMdx(`<div {...divProps}>Example</div>`);

      expect(result.code).not.toContain("divProps");
    });
  });

  describe("Children", () => {
    it("should preserve text children", () => {
      const result = compileMdx(`<p>Hello world</p>`);

      expect(result.code).toContain('"Hello world"');
    });

    it("should route nested JSX tags independently of their parent", () => {
      const result = compileMdx(
        `<div>Hello <a href="/x">link</a> and <strong>bold</strong></div>`
      );

      expect(result.code).toContain("_components.div");
      expect(result.code).toContain("_components.a");
      expect(result.code).toContain("_components.strong");
    });

    it("should preserve Markdown-syntax content nested inside a JSX tag", () => {
      const result = compileMdx(
        `<div>\n\nSome **bold** text and a [markdown link](/y).\n\n</div>`
      );

      expect(result.code).toContain("_components.div");
      expect(result.code).toContain("_components.strong");
      expect(result.code).toContain("_components.a");
      expect(result.code).toContain('href: "/y"');
    });
  });

  describe("img is excluded", () => {
    it("should not convert a standalone img tag", () => {
      const result = compileMdx(`<img alt="Example" src="./my-image.jpg" />`);

      expect(result.code).toContain(`_jsx("img"`);
      expect(result.code).not.toContain("_components.img");
    });

    it("should still convert a non-img tag wrapping an img tag", () => {
      const result = compileMdx(
        `<figure><img alt="Example" src="./my-image.jpg" /></figure>`
      );

      expect(result.code).toContain("_components.figure");
      expect(result.code).toContain(`_jsx("img"`);
      expect(result.code).not.toContain("_components.img");
    });
  });

  describe("Tags outside the standard list are untouched", () => {
    it("should not convert a capitalized custom component", () => {
      const result = compileMdx(`<MyComponent>Example</MyComponent>`);

      expect(result.code).toContain("_jsx(MyComponent");
      expect(result.code).not.toContain("_components.MyComponent");
    });

    it("should not convert a deprecated HTML tag left out of the list", () => {
      // An attribute forces Sätteri's own baseline (no-plugin) output to a
      // literal tag too — see "Sätteri's own implicit/explicit baseline"
      // below. Without one, an untouched tag already compiles as literal or
      // implicit depending on that baseline, which would make this
      // assertion pass for the wrong reason.
      const result = compileMdx(`<marquee loop="true">Example</marquee>`);

      expect(result.code).toContain(`_jsx("marquee"`);
      expect(result.code).not.toContain("_components.marquee");
    });

    it("should not convert a custom (hyphenated) element", () => {
      const result = compileMdx(`<my-widget data-foo="bar">Example</my-widget>`);

      expect(result.code).toContain(`_jsx("my-widget"`);
      expect(result.code).not.toContain("_components");
    });

    it("should not break a JSX fragment", () => {
      const result = compileMdx(`<>Example</>`);

      expect(result.code).toContain("_Fragment");
      expect(result.code).not.toContain("_components");
    });
  });

  describe("Markdown syntax elements are not double-processed", () => {
    it("should already route Markdown-syntax elements through the components mapping without this plugin's involvement", () => {
      const result = mdxToJs(`**bold** and a [link](/y).`, {
        hastPlugins: [],
      });

      expect(result.code).toContain("_components.strong");
      expect(result.code).toContain("_components.a");
    });
  });

  describe("Sätteri's own implicit/explicit baseline", () => {
    it("should already route an attribute-less JSX tag through the components mapping without any plugin", () => {
      // Sätteri only marks a JSX tag "explicit" (bypassing the components
      // mapping) when it carries attributes; a bare `<div>` is implicit by
      // default. This plugin's job is only to cover the *attributed* case.
      const result = mdxToJs(`<div>Example</div>`, { hastPlugins: [] });

      expect(result.code).toContain("_components.div");
    });

    it("should compile an attributed JSX tag as a literal tag without this plugin", () => {
      const result = mdxToJs(`<div className="card">Example</div>`, {
        hastPlugins: [],
      });

      expect(result.code).toContain(`_jsx("div"`);
      expect(result.code).not.toContain("_components.div");
    });
  });
});
