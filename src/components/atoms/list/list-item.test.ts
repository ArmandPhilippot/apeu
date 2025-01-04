import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import ListItem from "./list-item.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("ListItem", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof ListItem>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(ListItem, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can hide the list marker", async ({ container }) => {
    const props = {
      hideMarker: true,
    } satisfies ComponentProps<typeof ListItem>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(ListItem, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-marker="false"');
  });
});
