import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Button from "./button.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("button", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children in a button tag using secondary by default", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {} satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</button>");
    expect(result).toContain('data-type="secondary"');
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can use the primary kind", async ({ container }) => {
    expect.assertions(1);

    const props = {
      kind: "primary",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-type="primary"');
  });

  it<LocalTestContext>("can use the discreet kind", async ({ container }) => {
    expect.assertions(1);

    const props = {
      kind: "discreet",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-type="discreet"');
  });

  it<LocalTestContext>("can use the neutral kind", async ({ container }) => {
    expect.assertions(1);

    const props = {
      kind: "neutral",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-type="neutral"');
  });

  it<LocalTestContext>("can render an anchor tag", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "a",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</a>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render indicate the target as external", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isExternal: true,
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-external="true"');
  });

  it<LocalTestContext>("throws an error when using isExternal with primary kind", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      isExternal: true,
      kind: "primary",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";

    await expect(async () =>
      container.renderToString(Button, {
        props,
        slots: { default: body },
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: A button must not use primary kind for external resources!]`
    );
  });
});
