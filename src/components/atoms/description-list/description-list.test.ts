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
    const props = {} satisfies ComponentProps<typeof DescriptionList>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(DescriptionList, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</dl>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an inlined description list", async ({
    container,
  }) => {
    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof DescriptionList>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(DescriptionList, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</dl>");
    expect(result).toContain("inline");
  });
});
