import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Fieldset from "./fieldset.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Fieldset", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a legend and its children", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {} satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";
    const legend = "pariatur dolorem ipsum";
    const result = await container.renderToString(Fieldset, {
      props,
      slots: { default: body, legend },
    });

    expect(result).toContain("</fieldset>");
    expect(result).toContain(legend);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("throws an error if the legend slot is missing", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {} satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";

    await expect(async () =>
      container.renderToString(Fieldset, {
        props,
        slots: { default: body },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[MissingSlotError: A legend slot is required.]`
    );
  });

  it<LocalTestContext>("can render a bordered fieldset", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isBordered: true,
    } satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";
    const legend = "pariatur dolorem ipsum";
    const result = await container.renderToString(Fieldset, {
      props,
      slots: { default: body, legend },
    });

    expect(result).toContain('data-border="true"');
  });

  it<LocalTestContext>("can render an inlined fieldset", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";
    const legend = "pariatur dolorem ipsum";
    const result = await container.renderToString(Fieldset, {
      props,
      slots: { default: body, legend },
    });

    expect(result).toContain('data-inline="true"');
  });

  it<LocalTestContext>("throws an error when gap is used without isInline", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      gap: "md",
    } satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";
    const legend = "pariatur dolorem ipsum";

    await expect(async () =>
      container.renderToString(Fieldset, {
        props,
        slots: { default: body, legend },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[InvalidPropsError: gap is only compatible with isInline]`
    );
  });
});
