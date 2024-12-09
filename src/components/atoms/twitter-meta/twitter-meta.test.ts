import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import TwitterMeta from "./twitter-meta.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("TwitterMeta", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("can render a meta for the card type", async ({
    container,
  }) => {
    const props = {
      card: "player",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:card" content="${props.card}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the site url", async ({
    container,
  }) => {
    const props = {
      site: "https://example.test",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:site" content="${props.site}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the creator name", async ({
    container,
  }) => {
    const props = {
      creator: "Mike77",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:creator" content="${props.creator}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the page title", async ({
    container,
  }) => {
    const props = {
      title: "assumenda eos maiores",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:title" content="${props.title}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the page description", async ({
    container,
  }) => {
    const props = {
      description: "iste sint eum",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:description" content="${props.description}"`,
    );
  });

  it<LocalTestContext>("can render a meta and truncate its contents for the page description", async ({
    container,
  }) => {
    const descriptionMaxLength = 200;
    const props = {
      description:
        "Officia fugiat odit a officiis dicta commodi incidunt. Omnis est blanditiis et et tempore. Impedit et libero ratione nobis et repudiandae. Quibusdam est laborum doloribus eligendi accusantium necessitatibus. Aspernatur accusantium quod deserunt perferendis autem reiciendis. Iusto blanditiis asperiores autem.",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:description" content="${`${props.description.slice(0, descriptionMaxLength - 1)}…`}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the image", async ({
    container,
  }) => {
    const props = {
      image: "https://picsum.photos/640/480",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `<meta name="twitter:image" content="${props.image}"`,
    );
  });
});
