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
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      authorsProfilePage: ["et-nulla-et", "facilis-non-reiciendis"],
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    const meta = [...result.matchAll(/<meta.*?property="article:author"/g)];

    expect(meta).toHaveLength(props.authorsProfilePage.length);
    expect(result).toContain(`content="${props.authorsProfilePage[0]}"`);
    expect(result).toContain(`content="${props.authorsProfilePage[1]}"`);
  });

  it<LocalTestContext>("can render a meta for the expiration time", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      expirationTime: new Date(),
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect(result).toContain('property="article:expiration_time"');
    expect(result).toContain(props.expirationTime.toISOString());
  });

  it<LocalTestContext>("can render a meta for the modified time", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      modifiedTime: new Date(),
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect(result).toContain(
      `content="${props.modifiedTime.toISOString()}" property="article:modified_time"`
    );
  });

  it<LocalTestContext>("can render a meta for the published time", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      publishedTime: new Date(),
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect(result).toContain(
      `content="${props.publishedTime.toISOString()}" property="article:published_time"`
    );
  });

  it<LocalTestContext>("can render a meta for the section", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      section: "neque",
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    expect(result).toContain(
      `content="${props.section}" property="article:section"`
    );
  });

  it<LocalTestContext>("can render a meta for each tag", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      tags: ["placeat", "velit"],
    } satisfies ComponentProps<typeof OpenGraphArticle>;
    const result = await container.renderToString(OpenGraphArticle, {
      props,
    });

    const meta = [...result.matchAll(/<meta.*?property="article:tag"/g)];

    expect(meta).toHaveLength(props.tags.length);
    expect(result).toContain(`content="${props.tags[0]}"`);
    expect(result).toContain(`content="${props.tags[1]}"`);
  });
});
