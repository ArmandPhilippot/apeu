import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Term from "./term.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Term", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Term>;
    const body = "pariatur dolorem ipsum";
    const result = await container.renderToString(Term, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</dt>");
    expect(result).toContain(body);
  });
});
