import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Section from "./section.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Section", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its heading and contents", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const heading = "The heading section";
    const contents = "The contents.";
    const props = {} satisfies ComponentProps<typeof Section>;
    const result = await container.renderToString(Section, {
      props,
      slots: {
        heading,
        default: contents,
      },
    });

    expect(result).toContain(heading);
    expect(result).toContain(contents);
  });

  it<LocalTestContext>("can render CTAs", async ({ container }) => {
    expect.assertions(1);

    const heading = "The heading section";
    const contents = "The contents.";
    const cta = "This is a CTA!";
    const props = {} satisfies ComponentProps<typeof Section>;
    const result = await container.renderToString(Section, {
      props,
      slots: {
        heading,
        cta,
        default: contents,
      },
    });

    expect(result).toContain(cta);
  });
});
