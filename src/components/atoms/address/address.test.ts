import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Address from "./address.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Address", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    const address = "dolor voluptatem tenetur";
    const result = await container.renderToString(Address, {
      slots: { default: address },
    });

    expect.assertions(1);

    expect(result).toContain(`${address}</address>`);
  });
});
