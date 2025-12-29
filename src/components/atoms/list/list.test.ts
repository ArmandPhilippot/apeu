import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import List from "./list.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("List", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its children in an unordered list by default", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</ul>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an unordered list", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      as: "ul",
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</ul>");
  });

  it<LocalTestContext>("can render an ordered list", async ({ container }) => {
    expect.assertions(1);

    const props = {
      as: "ol",
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect(result).toContain("</ol>");
  });

  it<LocalTestContext>("can render a list inlined", async ({ container }) => {
    expect.assertions(1);

    const props = {
      isInline: true,
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-inline="true"');
  });

  it<LocalTestContext>("can hide the list marker", async ({ container }) => {
    expect.assertions(1);

    const props = {
      hideMarker: true,
    } satisfies ComponentProps<typeof List>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect(result).toContain('data-marker="false"');
  });

  it<LocalTestContext>("should generate correct CSS variables for spacing", async ({
    container,
  }) => {
    expect.assertions(1);

    const props: ComponentProps<typeof List> = { spacing: "md" };
    const body = "id quibusdam eius";
    const result = await container.renderToString(List, {
      props,
      slots: { default: body },
    });

    expect(result).toMatch(/--gap: var\(--spacing-md\)/);
  });
});
