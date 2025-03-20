import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Blockquote from "./blockquote.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("blockquote", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("should renders its children", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const quote = "dolor voluptatem tenetur";
    const result = await container.renderToString(Blockquote, {
      slots: { default: quote },
    });

    expect(result).toContain("<blockquote");
    expect(result).toContain(quote);
  });

  it<LocalTestContext>("should render a figcaption", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const quote = "dolor voluptatem tenetur";
    const caption = "impedit id pariatur";
    const result = await container.renderToString(Blockquote, {
      slots: { default: quote, caption },
    });

    expect(result).toContain("<figcaption");
    expect(result).toContain(caption);
  });
});
