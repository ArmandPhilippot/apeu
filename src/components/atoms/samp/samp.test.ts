import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Samp from "./samp.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Samp", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    const samp = "dolor voluptatem tenetur";
    const result = await container.renderToString(Samp, {
      slots: { default: samp },
    });

    expect.assertions(1);

    expect(result).toContain(`${samp}</samp>`);
  });
});
