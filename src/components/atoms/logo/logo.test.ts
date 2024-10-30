import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Logo from "./logo.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Logo", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the website logo as SVG", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Logo>;
    const result = await container.renderToString(Logo, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain("</svg>");
  });
});
