import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Spinner from "./spinner.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Spinner", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a spinner", async ({ container }) => {
    const props = {} satisfies ComponentProps<typeof Spinner>;
    const result = await container.renderToString(Spinner, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain("spinner-icon");
    expect(result).toContain(`aria-hidden="true"`);
  });

  it<LocalTestContext>("can render a message under the spinner", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Spinner>;
    const body = "totam excepturi voluptatem";
    const result = await container.renderToString(Spinner, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(body);
    expect(result).toContain("--spinner-flow: column");
  });

  it<LocalTestContext>("can render a message on top of the spinner", async ({
    container,
  }) => {
    const props = {
      isReversed: true,
    } satisfies ComponentProps<typeof Spinner>;
    const body = "totam excepturi voluptatem";
    const result = await container.renderToString(Spinner, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(body);
    expect(result).toContain("--spinner-flow: column-reverse");
  });

  it<LocalTestContext>("can render a message inlined after the spinner", async ({
    container,
  }) => {
    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof Spinner>;
    const body = "totam excepturi voluptatem";
    const result = await container.renderToString(Spinner, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(body);
    expect(result).toContain("--spinner-flow: row");
  });

  it<LocalTestContext>("can render a message inlined before the spinner", async ({
    container,
  }) => {
    const props = {
      isInline: true,
      isReversed: true,
    } satisfies ComponentProps<typeof Spinner>;
    const body = "totam excepturi voluptatem";
    const result = await container.renderToString(Spinner, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(body);
    expect(result).toContain("--spinner-flow: row-reverse");
  });
});
