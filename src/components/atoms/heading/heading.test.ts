import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Heading from "./heading.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Heading", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a h2 by default", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Heading>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Heading, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</h2>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a h1", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "h1",
    } satisfies ComponentProps<typeof Heading>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Heading, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</h1>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a h3", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "h3",
    } satisfies ComponentProps<typeof Heading>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Heading, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</h3>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a h4", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "h4",
    } satisfies ComponentProps<typeof Heading>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Heading, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</h4>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a h5", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "h5",
    } satisfies ComponentProps<typeof Heading>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Heading, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</h5>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a h6", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      as: "h6",
    } satisfies ComponentProps<typeof Heading>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Heading, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</h6>");
    expect(result).toContain(body);
  });
});
