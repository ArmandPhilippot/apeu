import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import CodePreview from "./code-preview.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("CodePreview", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children as preview", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof CodePreview>;
    const children = "some preview code";
    const result = await container.renderToString(CodePreview, {
      props,
      slots: { default: children },
    });

    expect(result).toContain("</figure>");
    expect(result).toContain(children);
  });

  it<LocalTestContext>("renders code as props", async ({ container }) => {
    expect.assertions(1);

    const props = {
      code: "This is code",
    } satisfies ComponentProps<typeof CodePreview>;
    const result = await container.renderToString(CodePreview, {
      props,
    });

    expect(result).toContain("This is code");
  });

  it<LocalTestContext>("can render both its children and code", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      code: "This is code",
    } satisfies ComponentProps<typeof CodePreview>;
    const children = "some preview code";
    const result = await container.renderToString(CodePreview, {
      props,
      slots: { default: children },
    });

    expect(result).toContain(children);
    expect(result).toContain("This is code");
    expect(result).toContain("Use");
    expect(result).toContain("Preview");
  });

  it<LocalTestContext>("can render a figcaption", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      code: "This is code",
      label: "This is a preview",
    } satisfies ComponentProps<typeof CodePreview>;
    const result = await container.renderToString(CodePreview, {
      props,
    });

    expect(result).toContain("This is a preview");
    expect(result).toContain("</figcaption");
  });
});
