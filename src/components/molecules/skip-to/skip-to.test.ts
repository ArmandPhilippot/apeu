import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import SkipTo from "./skip-to.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SkipTo", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a link", async ({ container }) => {
    const label = "et ea ratione";
    const props = {
      anchor: "#autem-qui-at",
    } satisfies ComponentProps<typeof SkipTo>;
    const result = await container.renderToString(SkipTo, {
      props,
      slots: { default: label },
    });

    expect.assertions(3);

    expect(result).toContain("</a>");
    expect(result).toContain(label);
    expect(result).toContain(`href="${props.anchor}"`);
  });

  it<LocalTestContext>("throws an error when the to prop is not an anchor", async ({
    container,
  }) => {
    const label = "et ea ratione";

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(SkipTo, {
        props: { anchor: "illum-consequuntur-minima" },
        slots: { default: label },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: The \`anchor\` property should be targeting an id on the same page. It must start with \`#\`.]`,
    );
  });
});
