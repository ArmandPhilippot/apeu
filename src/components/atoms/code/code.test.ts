import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Code from "./code.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Code", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render an inlined code", async ({
    container,
  }) => {
    const body = "id quibusdam eius";
    const result = await container.renderToString(Code, {
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(`${body}</code>`);
  });
});
