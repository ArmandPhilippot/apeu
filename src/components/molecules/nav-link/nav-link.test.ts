import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import NavLink from "./nav-link.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("NavLink", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a link", async ({ container }) => {
    const props = {
      href: "#eius-voluptas-iste",
    } satisfies Omit<ComponentProps<typeof NavLink>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavLink, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(body);
    expect(result).toContain(props.href);
  });

  it<LocalTestContext>("can use the block variant", async ({ container }) => {
    const props = {
      href: "#eius-voluptas-iste",
      isBlock: true,
    } satisfies Omit<ComponentProps<typeof NavLink>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavLink, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("block");
  });

  it<LocalTestContext>("can be bordered", async ({ container }) => {
    const props = {
      href: "#eius-voluptas-iste",
      isBordered: true,
    } satisfies Omit<ComponentProps<typeof NavLink>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavLink, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("bordered");
  });
});
