import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Figcaption from "./figcaption.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Figcaption", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a figcaption and its children", async ({
    container,
  }) => {
    const body = "id quibusdam eius";
    const result = await container.renderToString(Figcaption, {
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</figcaption>");
    expect(result).toContain(body);
  });
});
