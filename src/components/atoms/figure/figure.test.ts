import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Figure from "./figure.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Figure", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a figure and its children", async ({
    container,
  }) => {
    const body = "id quibusdam eius";
    const result = await container.renderToString(Figure, {
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</figure>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a centered figure", async ({
    container,
  }) => {
    const props = { isCentered: true } satisfies ComponentProps<typeof Figure>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Figure, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</figure>");
    expect(result).toContain("centered");
  });

  it<LocalTestContext>("can render a full-width figure", async ({
    container,
  }) => {
    const props = { isFullWidth: true } satisfies ComponentProps<typeof Figure>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Figure, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</figure>");
    expect(result).toContain("full-width");
  });
});
