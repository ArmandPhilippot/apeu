import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import TextField from "./text-field.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("TextField", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render an input", async ({ container }) => {
    const props = {
      type: "date",
    } satisfies ComponentProps<typeof TextField>;
    const result = await container.renderToString(TextField, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain("<input");
    expect(result).toContain(`type="${props.type}"`);
  });

  it<LocalTestContext>("can render a textarea", async ({ container }) => {
    const props = {
      type: "textarea",
    } satisfies ComponentProps<typeof TextField>;
    const result = await container.renderToString(TextField, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain("<textarea");
  });
});
