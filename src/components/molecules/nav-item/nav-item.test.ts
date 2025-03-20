import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import NavItem from "./nav-item.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("NavItem", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a link", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      href: "#eius-voluptas-iste",
    } satisfies Omit<ComponentProps<typeof NavItem<"a">>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavItem, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(body);
    expect(result).toContain(props.href);
  });

  it<LocalTestContext>("can render a label", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "label",
    } satisfies ComponentProps<typeof NavItem<"label">>;
    const label = "odit et placeat";
    const result = await container.renderToString(NavItem, {
      props,
      slots: { default: label },
    });

    expect(result).toContain(label);
    expect(result).toContain("</label>");
  });

  it<LocalTestContext>("can use the block variant", async ({ container }) => {
    expect.assertions(1);

    const props = {
      href: "#eius-voluptas-iste",
      isBlock: true,
    } satisfies Omit<ComponentProps<typeof NavItem<"a">>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavItem, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-block="true"');
  });

  it<LocalTestContext>("can be bordered", async ({ container }) => {
    expect.assertions(1);

    const props = {
      href: "#eius-voluptas-iste",
      isBordered: true,
    } satisfies Omit<ComponentProps<typeof NavItem<"a">>, "children">;
    const body = "id quibusdam eius";
    const result = await container.renderToString(NavItem, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-border="true"');
  });

  it<LocalTestContext>("can render an item with an SVG icon", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      href: "#dolorem-possimus-impedit",
      icon: "caret",
    } satisfies ComponentProps<typeof NavItem<"a">>;
    const anchor = "odit et placeat";
    const result = await container.renderToString(NavItem, {
      props,
      slots: { default: anchor },
    });

    expect(result).toContain(`</svg>`);
  });
});
