import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Cite from "./cite.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Cite", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    const cite = "dolor voluptatem tenetur";
    const result = await container.renderToString(Cite, {
      slots: { default: cite },
    });

    expect.assertions(1);

    expect(result).toContain(`${cite}</cite>`);
  });
});
