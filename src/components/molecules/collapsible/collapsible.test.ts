import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Collapsible from "./collapsible.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Collapsible", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a label and a body", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Collapsible>;
    const label = "et beatae ut";
    const body = "in aut quia";
    const result = await container.renderToString(Collapsible, {
      props,
      slots: { default: body, label },
    });

    expect.assertions(2);

    expect(result).toContain(label);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("throws when the label slot is missing", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Collapsible>;
    const body = "in aut quia";

    expect.assertions(1);

    await expect(() =>
      container.renderToString(Collapsible, {
        props,
        slots: { default: body },
      }),
    ).rejects.toThrowError();
  });
});
