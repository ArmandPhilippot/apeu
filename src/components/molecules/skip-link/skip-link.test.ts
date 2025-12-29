import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import SkipLink from "./skip-link.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SkipLink", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a link", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const label = "et ea ratione";
    const props = {
      to: "#autem-qui-at",
    } satisfies ComponentProps<typeof SkipLink>;
    const result = await container.renderToString(SkipLink, {
      props,
      slots: { default: label },
    });

    expect(result).toContain("</a>");
    expect(result).toContain(label);
    expect(result).toContain(`href="${props.to}"`);
  });

  it<LocalTestContext>("throws an error when the `to` prop is not an anchor", async ({
    container,
  }) => {
    expect.assertions(1);

    const label = "et ea ratione";

    await expect(async () =>
      container.renderToString(SkipLink, {
        props: { to: "illum-consequuntur-minima" },
        slots: { default: label },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[InvalidAnchorFormatError: The "to" property should be a valid anchor starting with "#". Received: illum-consequuntur-minima]`
    );
  });
});
