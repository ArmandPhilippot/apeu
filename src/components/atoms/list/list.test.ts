import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import List from "./list.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("List", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children in an unordered list by default", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</ul>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an unordered list", async ({
    container,
  }) => {
    const props = {
      as: "ul",
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("</ul>");
  });

  it<LocalTestContext>("can render an ordered list", async ({ container }) => {
    const props = {
      as: "ol",
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("</ol>");
  });

  it<LocalTestContext>("can render a list inlined", async ({ container }) => {
    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("inline");
  });

  it<LocalTestContext>("can hide the list marker", async ({ container }) => {
    const props = {
      hideMarker: true,
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("no-marker");
  });
});
