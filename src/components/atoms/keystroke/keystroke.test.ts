import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Keystroke from "./keystroke.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Keystroke", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should render a kbd element", async ({ container }) => {
    const body = "id quibusdam eius";
    const result = await container.renderToString(Keystroke, {
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(`${body}</kbd>`);
  });
});
