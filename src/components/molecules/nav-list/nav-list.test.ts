import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import NavList from "./nav-list.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("NavList", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    expect.assertions(1);

    const props = {
      items: [
        { label: "Item 1", path: "#item-1" },
        { label: "Item 2", path: "#item-2" },
      ],
    } satisfies Omit<ComponentProps<typeof NavList>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavList, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an ordered nav list", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isOrdered: true,
      items: [
        { label: "Item 1", path: "#item-1" },
        { label: "Item 2", path: "#item-2" },
      ],
    } satisfies Omit<ComponentProps<typeof NavList>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavList, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</ol>");
  });
});
