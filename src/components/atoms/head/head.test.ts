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
    const props = {
      brand: "et a dolores",
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect.assertions(5);

    expect(result).toContain("</head>");
    expect(result).toContain('<meta charset="utf-8">');
    expect(result).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">',
    );
    expect(result).toContain(`<title>${props.seo.title}</title>`);
    expect(result).toContain('<meta name="robots" content="index, follow">');
  });

  it<LocalTestContext>("can add the brand name to the page title", async ({
    container,
  }) => {
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

    expect.assertions(1);

    expect(result).toContain(
      `<title>${props.seo.title} | ${props.brand}</title>`,
    );
  });

  it<LocalTestContext>("can render a meta description", async ({
    container,
  }) => {
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

    expect.assertions(2);

    expect(result).toContain('<meta name="description"');
    expect(result).toContain(props.seo.description);
  });

  it<LocalTestContext>("can set robots nofollow", async ({ container }) => {
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

    expect.assertions(1);

    expect(result).toContain(`<meta name="robots" content="index, nofollow">`);
  });

  it<LocalTestContext>("can set robots noindex", async ({ container }) => {
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

    expect.assertions(1);

    expect(result).toContain(`<meta name="robots" content="noindex, follow">`);
  });

  it<LocalTestContext>("can add a meta for alternate languages", async ({
    container,
  }) => {
    const props = {
      brand: "et a dolores",
      seo: {
        languages: [
          { locale: "fr", url: "/modi-odit-voluptatem" },
          { locale: "es", url: "/et-sint-laudantium" },
        ],
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain(
      `<link rel="alternate" href="${props.seo.languages[0]?.url}" hreflang="${props.seo.languages[0]?.locale}">`,
    );
    expect(result).toContain(
      `<link rel="alternate" href="${props.seo.languages[1]?.url}" hreflang="${props.seo.languages[1]?.locale}">`,
    );
  });

  it<LocalTestContext>("can update the meta related to page author", async ({
    container,
  }) => {
    const props = {
      brand: "et a dolores",
      seo: {
        author: { name: "Godfrey.Mann73", url: "https://example.test" },
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Head>;
    const result = await container.renderToString(Head, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain(
      `<meta name="author" content="${props.seo.author.name}">`,
    );
    expect(result).toContain(
      `<link rel="author" href="${props.seo.author.url}">`,
    );
  });

  it<LocalTestContext>("can add a meta for the color scheme", async ({
    container,
  }) => {
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

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="color-scheme" content="${props.colorScheme}">`,
    );
  });

  it<LocalTestContext>("can add a meta for the theme color", async ({
    container,
  }) => {
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

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="theme-color" content="${props.themeColor}">`,
    );
  });

  it<LocalTestContext>("can add a meta for the generator", async ({
    container,
  }) => {
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

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="generator" content="${props.generator}">`,
    );
  });

  it<LocalTestContext>("can render its children using a slot", async ({
    container,
  }) => {
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

    expect.assertions(1);

    expect(result).toContain(body);
  });
});
