import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import OpenGraphArticle from "./open-graph-article.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("OpenGraphArticle", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render a meta for each author", async ({
    container,
  }) => {
    const props = {
      authorsProfilePage: ["et-nulla-et", "facilis-non-reiciendis"],
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect.assertions(3);

    const meta = [...result.matchAll(/<meta property="article:author"/g)];

    expect(meta).toHaveLength(props.authorsProfilePage.length);
    expect(result).toContain(`content="${props.authorsProfilePage[0]}"`);
    expect(result).toContain(`content="${props.authorsProfilePage[1]}"`);
  });

  it<LocalTestContext>("can render a meta for the expiration time", async ({
    container,
  }) => {
    const props = {
      expirationTime: new Date(),
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect.assertions(2);

    expect(result).toContain('property="article:expiration_time"');
    expect(result).toContain(props.expirationTime.toISOString());
  });

  it<LocalTestContext>("can render a meta for the modified time", async ({
    container,
  }) => {
    const props = {
      modifiedTime: new Date(),
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="article:modified_time" content="${props.modifiedTime.toISOString()}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the published time", async ({
    container,
  }) => {
    const props = {
      publishedTime: new Date(),
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="article:published_time" content="${props.publishedTime.toISOString()}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the section", async ({
    container,
  }) => {
    const props = {
      section: "neque",
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="article:section" content="${props.section}"`,
    );
  });

  it<LocalTestContext>("can render a meta for each tag", async ({
    container,
  }) => {
    const props = {
      tags: ["placeat", "velit"],
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect.assertions(3);

    const meta = [...result.matchAll(/<meta property="article:tag"/g)];

    expect(meta).toHaveLength(props.tags.length);
    expect(result).toContain(`content="${props.tags[0]}"`);
    expect(result).toContain(`content="${props.tags[1]}"`);
  });
});
