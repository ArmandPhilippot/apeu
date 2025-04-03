import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import BackToTop from "./back-to-top.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("BackToTop", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders an anchor link with a visually hidden label", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      anchor: "#adipisci-non-odio",
      label: "dolor nam maiores",
    } satisfies ComponentProps<typeof BackToTop>;
    const result = await container.renderToString(BackToTop, {
      props,
    });

    expect(result).toContain(`href="${props.anchor}"`);
    expect(result).toContain(props.label);
  });

  it<LocalTestContext>("can use a custom scroll threshold", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      anchor: "#adipisci-non-odio",
      label: "dolor nam maiores",
      scrollThreshold: 500,
    } satisfies ComponentProps<typeof BackToTop>;
    const result = await container.renderToString(BackToTop, {
      props,
    });

    expect(result).toContain(`data-threshold="${props.scrollThreshold}"`);
  });
});
