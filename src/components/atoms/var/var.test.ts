import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Var from "./var.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Var", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    const variable = "dolor voluptatem tenetur";
    const result = await container.renderToString(Var, {
      slots: { default: variable },
    });

    expect.assertions(1);

    expect(result).toContain(`${variable}</var>`);
  });
});
