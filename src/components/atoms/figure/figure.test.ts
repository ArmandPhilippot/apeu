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
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const body = "id quibusdam eius";
    const result = await container.renderToString(Figure, {
      slots: { default: body },
    });

    expect(result).toContain("</figure>");
    expect(result).toContain(body);
    expect(result).toContain('data-centered="false"');
    expect(result).toContain('data-full-width="false"');
  });

  it<LocalTestContext>("can render a centered figure", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = { isCentered: true } satisfies ComponentProps<typeof Figure>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Figure, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</figure>");
    expect(result).toContain('data-centered="true"');
  });

  it<LocalTestContext>("can render a full-width figure", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = { isFullWidth: true } satisfies ComponentProps<typeof Figure>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Figure, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</figure>");
    expect(result).toContain('data-full-width="true"');
  });
});
