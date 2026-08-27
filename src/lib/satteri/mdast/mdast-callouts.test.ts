import { mdxToJs, type MdxCompileOptions } from "satteri";
import { describe, expect, it } from "vitest";
import { CALLOUT_TYPES } from "../../../utils/constants";
import { mdastCallouts } from "./mdast-callouts";

const OPTIONS: MdxCompileOptions = {
  mdastPlugins: [mdastCallouts],
  features: { directive: true },
};

describe("mdast-callouts", () => {
  it("should transform a valid directive into a callout element", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain("callout");
    expect(result.code).toContain(
      "Natus inventore eveniet est nulla veritatis aut."
    );
  });

  it("should not transform an unknown directive", async () => {
    expect.assertions(1);

    const mdx = `
:::unsupported
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).not.toContain("callout");
  });

  it.each(CALLOUT_TYPES)("should transform the %s directive", async (type) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mdx = `
:::${type}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain("callout");
    expect(result.code).toContain(`type: "${type}"`);
  });

  it("should set the type property from the directive name", async () => {
    expect.assertions(1);

    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('type: "warning"');
  });

  it("should support labels in plain text", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mdx = `
:::warning[A custom title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('label: "A custom title"');
    expect(result.code).toContain(
      "Natus inventore eveniet est nulla veritatis aut."
    );
  });

  it("should remove Markdown syntax from the label when Markdown formatting is present", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mdx = `
:::warning[A **custom** title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    // Satteri's textContent strips raw markdown syntax in the label
    expect(result.code).toContain('label: "A custom title"');
    expect(result.code).toContain(
      "Natus inventore eveniet est nulla veritatis aut."
    );
  });

  it("should not include a label property when no label is provided", async () => {
    expect.assertions(1);

    const mdx = `
:::warning
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).not.toContain('label: "');
  });

  it("should exclude the label paragraph from the callout children", async () => {
    expect.assertions(1);

    const mdx = `
:::warning[A custom title]
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    // The label paragraph should not appear as a child element
    expect(result.code).not.toContain("A custom title</p>");
  });

  it("should forward HTML attributes from the directive", async () => {
    expect.assertions(1);

    const mdx = `
:::warning{role="alert"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('role: "alert"');
  });

  it("should forward multiple HTML attributes", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(2);

    const mdx = `
:::warning{role="alert" id="my-callout"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('role: "alert"');
    expect(result.code).toContain('id: "my-callout"');
  });

  it("should handle a directive with both a label and attributes", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const mdx = `
:::warning[Important!]{role="alert"}
Natus inventore eveniet est nulla veritatis aut.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain('label: "Important!"');
    expect(result.code).toContain('role: "alert"');
    expect(result.code).toContain('type: "warning"');
  });

  it("should render callout content correctly", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const mdx = `
:::info
First paragraph.

Second paragraph.
:::`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).toContain("callout");
    expect(result.code).toContain("First paragraph.");
    expect(result.code).toContain("Second paragraph.");
  });

  it("should not affect non-directive content", async () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory.
    expect.assertions(3);

    const mdx = `
# Heading

Some paragraph.
`;
    const result = await mdxToJs(mdx, OPTIONS);

    expect(result.code).not.toContain("callout");
    expect(result.code).toContain("Heading");
    expect(result.code).toContain("Some paragraph.");
  });
});
