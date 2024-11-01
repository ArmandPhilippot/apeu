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

    expect(result).toContain("bordered");
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

    expect(result).toContain("centered");
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

    expect(result).toContain("prose");
  });
});
