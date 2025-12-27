import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import PageOpener from "./page-opener.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("PageOpener", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a title in a header", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      title: "Lorem ipsum",
    } satisfies ComponentProps<typeof PageOpener>;
    const result = await container.renderToString(PageOpener, {
      props,
    });

    expect(result).toContain("</header>");
    expect(result).toContain(props.title);
  });

  it<LocalTestContext>("renders an introduction", async ({ container }) => {
    expect.assertions(1);

    const intro = "An introductory sentence.";
    const props = {
      title: "Lorem ipsum",
    } satisfies ComponentProps<typeof PageOpener>;
    const result = await container.renderToString(PageOpener, {
      props,
      slots: { intro },
    });

    expect(result).toContain(intro);
  });

  it<LocalTestContext>("renders metadata", async ({ container }) => {
    expect.assertions(1);

    const meta = "The page metadata";
    const props = {
      title: "Lorem ipsum",
    } satisfies ComponentProps<typeof PageOpener>;
    const result = await container.renderToString(PageOpener, {
      props,
      slots: { meta },
    });

    expect(result).toContain(meta);
  });

  it<LocalTestContext>("renders a cover", async ({ container }) => {
    expect.assertions(1);

    const props = {
      cover: {
        src: "https://picsum.photos/640/480",
        height: 480,
        width: 640,
      },
      title: "Lorem ipsum",
    } satisfies ComponentProps<typeof PageOpener>;
    const result = await container.renderToString(PageOpener, {
      props,
    });

    expect(result).toContain(props.cover.src);
  });

  it<LocalTestContext>("renders a link to a feed", async ({ container }) => {
    expect.assertions(1);

    const props = {
      feed: "#page-feed",
      title: "Lorem ipsum",
    } satisfies ComponentProps<typeof PageOpener>;
    const result = await container.renderToString(PageOpener, {
      props,
    });

    expect(result).toContain(props.feed);
  });
});
