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
    expect.assertions(1);

    const props = {
      card: "player",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.card}" name="twitter:card"`
    );
  });

  it<LocalTestContext>("can render a meta for the site url", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      site: "https://example.test",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.site}" name="twitter:site"`
    );
  });

  it<LocalTestContext>("can render a meta for the creator name", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      creator: "Mike77",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.creator}" name="twitter:creator"`
    );
  });

  it<LocalTestContext>("can render a meta for the page title", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      title: "assumenda eos maiores",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.title}" name="twitter:title"`
    );
  });

  it<LocalTestContext>("can render a meta for the page description", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      description: "iste sint eum",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.description}" name="twitter:description"`
    );
  });

  it<LocalTestContext>("can render a meta and truncate its contents for the page description", async ({
    container,
  }) => {
    expect.assertions(1);

    const descriptionMaxLength = 200;
    const props = {
      description:
        "Officia fugiat odit a officiis dicta commodi incidunt. Omnis est blanditiis et et tempore. Impedit et libero ratione nobis et repudiandae. Quibusdam est laborum doloribus eligendi accusantium necessitatibus. Aspernatur accusantium quod deserunt perferendis autem reiciendis. Iusto blanditiis asperiores autem.",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.description.slice(0, descriptionMaxLength - 1)}…" name="twitter:description"`
    );
  });

  it<LocalTestContext>("can render a meta for the image", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      image: "https://picsum.photos/640/480",
    } satisfies ComponentProps<typeof TwitterMeta>;
    const result = await container.renderToString(TwitterMeta, {
      props,
    });

    expect(result).toContain(
      `<meta content="${props.image}" name="twitter:image"`
    );
  });
});
