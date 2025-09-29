import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Head from "./head.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Head", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the default meta in head", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const props = {
      brand: "et a dolores",
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain("</head>");
    expect(result).toContain('<meta charset="utf-8">');
    expect(result).toContain(
      '<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport">'
    );
    expect(result).toContain(`<title>${props.seo.title}</title>`);
    expect(result).toContain('<meta content="index, follow" name="robots">');
  });

  it<LocalTestContext>("can add the brand name to the page title", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      addBrandToTitle: true,
      brand: "et a dolores",
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(
      `<title>${props.seo.title} | ${props.brand}</title>`
    );
  });

  it<LocalTestContext>("can render a meta description", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      brand: "et a dolores",
      seo: {
        description: "Tenetur quae error laboriosam ea et facere impedit odio.",
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain('name="description"');
    expect(result).toContain(props.seo.description);
  });

  it<LocalTestContext>("can set robots nofollow", async ({ container }) => {
    expect.assertions(1);

    const props = {
      brand: "et a dolores",
      seo: {
        nofollow: true,
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(`<meta content="index, nofollow" name="robots">`);
  });

  it<LocalTestContext>("can set robots noindex", async ({ container }) => {
    expect.assertions(1);

    const props = {
      brand: "et a dolores",
      seo: {
        noindex: true,
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(`<meta content="noindex, follow" name="robots">`);
  });

  it<LocalTestContext>("can update the meta related to page author", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      brand: "et a dolores",
      seo: {
        author: { name: "Godfrey.Mann73", website: "https://example.test" },
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.seo.author.name}" name="author">`
    );
    expect(result).toContain(
      `<link href="${props.seo.author.website}" rel="author">`
    );
  });

  it<LocalTestContext>("can add a meta for the color scheme", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      brand: "et a dolores",
      colorScheme: "light",
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.colorScheme}" name="color-scheme">`
    );
  });

  it<LocalTestContext>("can add a meta for the theme color", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      brand: "et a dolores",
      seo: {
        title: "est et fugiat",
      },
      themeColor: "#000000",
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.themeColor}" name="theme-color">`
    );
  });

  it<LocalTestContext>("can add a meta for the generator", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      brand: "et a dolores",
      generator: "enim",
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.generator}" name="generator">`
    );
  });

  it<LocalTestContext>("can render its children using a slot", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      brand: "et a dolores",
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Head, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(body);
  });
});
