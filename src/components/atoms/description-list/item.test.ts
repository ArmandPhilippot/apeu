import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Item from "./item.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Item", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Item>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(Item, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</div>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an inlined item", async ({ container }) => {
    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof Item>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(Item, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</div>");
    expect(result).toContain("inline");
  });

  it<LocalTestContext>("can render an item with col spacing", async ({
    container,
  }) => {
    const props = {
      colSpacing: "lg",
    } satisfies ComponentProps<typeof Item>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(Item, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</div>");
    expect(result).toContain(`var(--spacing-${props.colSpacing})`);
  });

  it<LocalTestContext>("can render an item with row spacing", async ({
    container,
  }) => {
    const props = {
      rowSpacing: "lg",
    } satisfies ComponentProps<typeof Item>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(Item, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</div>");
    expect(result).toContain(`var(--spacing-${props.rowSpacing})`);
  });
});
