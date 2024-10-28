import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import License from "./license.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("License", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders an svg element and its title", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof License>;
    const result = await container.renderToString(License, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain("</svg>");
    expect(result).toContain("Contents are under CC BY SA license.");
  });
});
