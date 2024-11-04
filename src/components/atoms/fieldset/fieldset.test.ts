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
    const props = {} satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";
    const legend = "pariatur dolorem ipsum";
    const result = await container.renderToString(Fieldset, {
      props,
      slots: { default: body, legend },
    });

    expect.assertions(3);

    expect(result).toContain("</fieldset>");
    expect(result).toContain(legend);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("throws an error if the legend slot is missing", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(Fieldset, {
        props,
        slots: { default: body },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: A legend slot is required.]`);
  });

  it<LocalTestContext>("can render a bordered fieldset", async ({
    container,
  }) => {
    const props = {
      isBordered: true,
    } satisfies ComponentProps<typeof Fieldset>;
    const body = "eius alias doloribus";
    const legend = "pariatur dolorem ipsum";
    const result = await container.renderToString(Fieldset, {
      props,
      slots: { default: body, legend },
    });

    expect.assertions(1);

    expect(result).toContain("bordered");
  });
});
