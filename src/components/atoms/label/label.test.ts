import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Label from "./label.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Label", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a label element", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Label>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Label, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</label>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a label as required", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      isRequired: true,
    } satisfies ComponentProps<typeof Label>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Label, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("aria-hidden");
    expect(result).toContain("*");
  });
});
