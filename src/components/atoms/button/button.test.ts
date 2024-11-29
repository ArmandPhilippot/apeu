import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Button from "./button.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Button", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children in a button tag using secondary by default", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect.assertions(3);

    expect(result).toContain("</button>");
    expect(result).toContain("secondary");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can use the primary kind", async ({ container }) => {
    const props = {
      kind: "primary",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("primary");
  });

  it<LocalTestContext>("can use the discreet kind", async ({ container }) => {
    const props = {
      kind: "discreet",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("discreet");
  });

  it<LocalTestContext>("can use the neutral kind", async ({ container }) => {
    const props = {
      kind: "neutral",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("neutral");
  });

  it<LocalTestContext>("can render an anchor tag", async ({ container }) => {
    const props = {
      as: "a",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain("</a>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render indicate the target as external", async ({
    container,
  }) => {
    const props = {
      isExternal: true,
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";
    const result = await container.renderToString(Button, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain("external");
  });

  it<LocalTestContext>("throws an error when using isExternal with primary kind", async ({
    container,
  }) => {
    const props = {
      isExternal: true,
      kind: "primary",
    } satisfies ComponentProps<typeof Button>;
    const body = "voluptas ratione saepe";

    expect.assertions(1);

    await expect(async () =>
      container.renderToString(Button, {
        props,
        slots: { default: body },
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: A button must not use primary kind for external resources!]`,
    );
  });
});
