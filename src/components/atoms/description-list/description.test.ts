import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Description from "./description.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Description", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Description>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(Description, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</dd>");
    expect(result).toContain(body);
  });
});
