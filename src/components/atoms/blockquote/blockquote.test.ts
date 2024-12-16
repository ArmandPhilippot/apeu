import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Blockquote from "./blockquote.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Blockquote", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    const quote = "dolor voluptatem tenetur";
    const result = await container.renderToString(Blockquote, {
      slots: { default: quote },
    });

    expect.assertions(2);

    expect(result).toContain("<blockquote");
    expect(result).toContain(quote);
  });

  it<LocalTestContext>("should render a figcaption", async ({ container }) => {
    const quote = "dolor voluptatem tenetur";
    const caption = "impedit id pariatur";
    const result = await container.renderToString(Blockquote, {
      slots: { default: quote, caption },
    });

    expect.assertions(2);

    expect(result).toContain("<figcaption");
    expect(result).toContain(caption);
  });
});
