import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Legend from "./legend.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Legend", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a legend element", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Legend>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Legend, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</legend>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a bordered legend", async ({
    container,
  }) => {
    const props = {
      isBordered: true,
    } satisfies ComponentProps<typeof Legend>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Legend, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-border="true"');
  });

  it<LocalTestContext>("can render an inlined legend", async ({
    container,
  }) => {
    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof Legend>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Legend, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-inline="true"');
  });
});