import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Page from "./page.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Page", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders its body", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {} satisfies ComponentProps<typeof Page>;
    const body = "consequatur placeat explicabo";
    const result = await container.renderToString(Page, {
      props,
      slots: { body },
    });

    expect(result).not.toContain("</h1>");
    expect(result).toContain(body);
  });

  it<LocalTestContext>("renders a heading", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      heading: "unde non eum",
    } satisfies ComponentProps<typeof Page>;
    const body = "consequatur placeat explicabo";
    const result = await container.renderToString(Page, {
      props,
      slots: { body },
    });

    expect(result).toContain("</h1>");
    expect(result).toContain(props.heading);
  });

  it<LocalTestContext>("can render a disconnected body", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      heading: "unde non eum",
    } satisfies ComponentProps<typeof Page>;
    const disconnectedBody = "consequatur placeat explicabo";
    const result = await container.renderToString(Page, {
      props,
      slots: { "disconnected-body": disconnectedBody },
    });

    expect(result).toContain(disconnectedBody);
  });

  it<LocalTestContext>("can render a cover", async ({ container }) => {
    expect.assertions(1);

    const props = {
      cover: {
        height: 480,
        src: "https://picsum.photos/640/480",
        width: 640,
      },
      heading: "unde non eum",
    } satisfies ComponentProps<typeof Page>;
    const result = await container.renderToString(Page, {
      props,
    });

    expect(result).toContain(props.cover.src);
  });

  it<LocalTestContext>("can render a subscribe button", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      feed: "#perspiciatis-excepturi-repellendus",
      heading: "unde non eum",
    } satisfies ComponentProps<typeof Page>;
    const result = await container.renderToString(Page, {
      props,
    });

    expect(result).toContain(props.feed);
  });

  it<LocalTestContext>("can render the page meta", async ({ container }) => {
    expect.assertions(1);

    const props = {
      heading: "unde non eum",
    } satisfies ComponentProps<typeof Page>;
    const meta = "quasi numquam explicabo";
    const result = await container.renderToString(Page, {
      props,
      slots: { meta },
    });

    expect(result).toContain(meta);
  });

  it<LocalTestContext>("can render the page footer", async ({ container }) => {
    expect.assertions(1);

    const props = {
      heading: "unde non eum",
    } satisfies ComponentProps<typeof Page>;
    const footer = "quasi numquam explicabo";
    const result = await container.renderToString(Page, {
      props,
      slots: { footer },
    });

    expect(result).toContain(footer);
  });

  it<LocalTestContext>("can render a table of contents", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      heading: "unde non eum",
      toc: [
        { depth: 1, slug: "#heading1", text: "Heading 1" },
        { depth: 1, slug: "#heading2", text: "Heading 2" },
      ] as const,
    } satisfies ComponentProps<typeof Page>;
    const result = await container.renderToString(Page, {
      props,
    });

    expect(result).toContain(props.toc[0].text);
    expect(result).toContain(props.toc[0].slug);
    expect(result).toContain(props.toc[1].text);
    expect(result).toContain(props.toc[1].slug);
  });
});
