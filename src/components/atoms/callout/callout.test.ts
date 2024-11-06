import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Callout from "./callout.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Callout", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render a callout of type info by default", async ({
    container,
  }) => {
    const props = {} satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="info"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a critical callout", async ({
    container,
  }) => {
    const props = {
      type: "critical",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props.type}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a discovery callout", async ({
    container,
  }) => {
    const props = {
      type: "discovery",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props.type}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an idea callout", async ({ container }) => {
    const props = {
      type: "idea",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props.type}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render an info callout", async ({ container }) => {
    const props = {
      type: "info",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props.type}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a success callout", async ({
    container,
  }) => {
    const props = {
      type: "success",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props.type}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a warning callout", async ({
    container,
  }) => {
    const props = {
      type: "warning",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props.type}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a critical callout using a data attribute", async ({
    container,
  }) => {
    const props = {
      "data-type": "critical",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="${props["data-type"]}"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("uses the default type when the data attribute is not a string", async ({
    container,
  }) => {
    const props = {
      "data-type": 42,
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="info"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("uses the default type when the data attribute is an invalid string", async ({
    container,
  }) => {
    const props = {
      "data-type": "foo",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(2);

    expect(result).toContain(`data-type="info"`);
    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a custom label", async ({ container }) => {
    const props = {
      label: "vel minus iste",
      type: "critical",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(3);

    expect(result).toContain(props.label);
    expect(result).toContain(`aria-label="${props.label}"`);
    expect(result).toContain('<div aria-hidden="true"');
  });

  it<LocalTestContext>("can use an aria label", async ({ container }) => {
    const props = {
      "aria-label": "officiis cum adipisci",
      label: "vel minus iste",
      type: "critical",
    } satisfies ComponentProps<typeof Callout>;
    const body = "pariatur omnis adipisci";
    const result = await container.renderToString(Callout, {
      props,
      slots: { default: body },
    });

    expect.assertions(3);

    expect(result).toContain(props.label);
    expect(result).toContain(`aria-label="${props["aria-label"]}"`);
    expect(result).not.toContain('<div aria-hidden="true"');
  });
});
