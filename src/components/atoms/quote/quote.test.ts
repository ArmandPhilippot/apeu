import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Quote from "./quote.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Quote", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a quote", async ({ container }) => {
    const body = "id quibusdam eius";
    const result = await container.renderToString(Quote, {
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(`${body}</q>`);
  });
});
