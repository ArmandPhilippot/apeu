import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Branding from "./branding.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Branding", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the website logo and name", async ({
    container,
  }) => {
    const props = {
      brand: "ut eum error",
      url: "#quam-at-provident",
    } satisfies ComponentProps<typeof Branding>;
    const result = await container.renderToString(Branding, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain(props.brand);
    expect(result).toContain(props.url);
  });
});
