import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { CALLOUT_TYPES } from "../../../utils/constants";
import { mdastCallouts } from "./mdast-callouts";

const OPTIONS: MdxCompileOptions = {
  mdastPlugins: [mdastCallouts],
  features: { directive: true },
};

describe("mdast-callouts", () => {
  it("should transform a valid directive into a callout element", () => {
    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain("callout");
    expect(result.code).toContain(
      "Natus inventore eveniet est nulla veritatis aut."
    );
  });

  it("should not transform an unknown directive", () => {
    const mdx = `
:::unsupported
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).not.toContain("callout");
  });

  it.each(CALLOUT_TYPES)("should transform the %s directive", (type) => {
    const mdx = `
:::${type}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain("callout");
    expect(result.code).toContain(`type: "${type}"`);
  });

  it("should set the type property from the directive name", () => {
    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('type: "warning"');
  });

  it("should support labels in plain text", () => {
    const mdx = `
:::warning[A custom title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('label: "A custom title"');
    expect(result.code).toContain(
      "Natus inventore eveniet est nulla veritatis aut."
    );
  });

  it("should remove Markdown syntax from the label when Markdown formatting is present", () => {
    const mdx = `
:::warning[A **custom** title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    // Satteri's textContent strips raw markdown syntax in the label
    expect(result.code).toContain('label: "A custom title"');
    expect(result.code).toContain(
      "Natus inventore eveniet est nulla veritatis aut."
    );
  });

  it("should not include a label property when no label is provided", () => {
    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).not.toContain('label: "');
  });

  it("should exclude the label paragraph from the callout children", () => {
    const mdx = `
:::warning[A custom title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    // The label paragraph should not appear as a child element
    expect(result.code).not.toContain("A custom title</p>");
  });

  it("should forward HTML attributes from the directive", () => {
    const mdx = `
:::warning{role="alert"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('role: "alert"');
  });

  it("should forward multiple HTML attributes", () => {
    const mdx = `
:::warning{role="alert" id="my-callout"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('role: "alert"');
    expect(result.code).toContain('id: "my-callout"');
  });

  it("should handle a directive with both a label and attributes", () => {
    const mdx = `
:::warning[Important!]{role="alert"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('label: "Important!"');
    expect(result.code).toContain('role: "alert"');
    expect(result.code).toContain('type: "warning"');
  });

  it("should render callout content correctly", () => {
    const mdx = `
:::info
First paragraph.

Second paragraph.
:::`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain("callout");
    expect(result.code).toContain("First paragraph.");
    expect(result.code).toContain("Second paragraph.");
  });

  it("should not affect non-directive content", () => {
    const mdx = `
# Heading

Some paragraph.
`;
    const result = mdxToJs(mdx, OPTIONS);

    expect(result.code).not.toContain("callout");
    expect(result.code).toContain("Heading");
    expect(result.code).toContain("Some paragraph.");
  });
});
