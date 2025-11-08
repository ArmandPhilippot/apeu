import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import DescriptionList from "./description-list.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("DescriptionList", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof DescriptionList>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(DescriptionList, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</dl>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an inlined description list", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof DescriptionList>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(DescriptionList, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-inline="true"');
  });

  it<LocalTestContext>("can use a col spacing", async ({ container }) => {
    expect.assertions(1);

    const props = {
      gap: { col: "lg" },
    } satisfies ComponentProps<typeof DescriptionList>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(DescriptionList, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(`var(--spacing-${props.gap.col})`);
  });

  it<LocalTestContext>("can use a row spacing", async ({ container }) => {
    expect.assertions(1);

    const props = {
      gap: { row: "lg" },
    } satisfies ComponentProps<typeof DescriptionList>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(DescriptionList, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(`var(--spacing-${props.gap.row})`);
  });
});
