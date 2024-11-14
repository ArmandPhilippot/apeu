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
    const props = {} satisfies ComponentProps<typeof Card>;
    const body = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render the card heading", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Card>;
    const heading = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { heading },
    });

    expect.assertions(2);

    expect(result).toContain(heading);
    expect(result).toContain("</header>");
  });

  it<LocalTestContext>("can render the card frontmatter", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Card>;
    const frontmatter = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { frontmatter },
    });

    expect.assertions(2);

    expect(result).toContain(frontmatter);
    expect(result).toContain("</header>");
  });

  it<LocalTestContext>("can render the card cover", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Card>;
    const cover = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { cover },
    });

    expect.assertions(2);

    expect(result).toContain(cover);
    expect(result).toContain("</header>");
  });

  it<LocalTestContext>("can render the card meta", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Card>;
    const meta = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { meta },
    });

    expect.assertions(3);

    expect(result).toContain("has-meta");
    expect(result).toContain(meta);
    expect(result).toContain("</footer>");
  });

  it<LocalTestContext>("can render the card cta", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Card>;
    const cta = "a molestiae placeat";
    const result = await container.renderToString(Card, {
      props,
      slots: { cta },
    });

    expect.assertions(2);

    expect(result).toContain(cta);
    expect(result).toContain("</footer>");
  });
});
