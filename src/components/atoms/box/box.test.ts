import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Box from "./box.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Box", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a bordered box", async ({ container }) => {
    const props = {
      isBordered: true,
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-border="true"');
  });

  it<LocalTestContext>("can render a centered box", async ({ container }) => {
    const props = {
      isCentered: true,
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-centered="true"');
  });

  it<LocalTestContext>("can render a raised box", async ({ container }) => {
    const props = {
      elevation: "raised",
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-elevation="raised"');
  });

  it<LocalTestContext>("can render an elevated box", async ({ container }) => {
    const props = {
      elevation: "elevated",
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-elevation="elevated"');
  });

  it<LocalTestContext>("can render a floating box", async ({ container }) => {
    const props = {
      elevation: "floating",
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-elevation="floating"');
  });

  it<LocalTestContext>("can render a padded box", async ({ container }) => {
    const props = {
      isPadded: true,
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-padded="true"');
  });

  it<LocalTestContext>("can render a box sized to prose", async ({
    container,
  }) => {
    const props = {
      isProse: true,
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-prose="true"');
  });

  it<LocalTestContext>("can render a rounded box", async ({ container }) => {
    const props = {
      isRounded: true,
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-rounded="true"');
  });

  it<LocalTestContext>("can render a spaced box", async ({ container }) => {
    const props = {
      isSpaced: true,
    } satisfies ComponentProps<typeof Box<"div">>;
    const body = "consequatur doloremque voluptas";
    const result = await container.renderToString(Box, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain('data-spaced="true"');
  });
});
