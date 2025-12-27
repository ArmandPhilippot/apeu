import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Card from "./card.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Card", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render the card body", async ({ container }) => {
    expect.assertions(1);

    const props = {} satisfies ComponentProps<typeof Card>;
    const body = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render the card heading", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Card>;
    const heading = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { heading },
    });

    expect(result).toContain(heading);
    expect(result).toContain("</header>");
  });

  it<LocalTestContext>("can render the card overline", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Card>;
    const overline = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { overline },
    });

    expect(result).toContain(overline);
    expect(result).toContain("</header>");
  });

  it<LocalTestContext>("can render the card cover", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Card>;
    const cover = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { cover },
    });

    expect(result).toContain(cover);
    expect(result).toContain("</header>");
  });

  it<LocalTestContext>("can render the card meta", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {} satisfies ComponentProps<typeof Card>;
    const meta = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { meta },
    });

    expect(result).toContain("has-meta");
    expect(result).toContain(meta);
    expect(result).toContain("</footer>");
  });

  it<LocalTestContext>("can render the card cta", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Card>;
    const cta = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { cta },
    });

    expect(result).toContain(cta);
    expect(result).toContain("</footer>");
  });
});
