import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import SocialLinks from "./social-links.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("SocialLinks", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a list of social links", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      links: {
        diaspora: "https://diaspora.test",
        github: "https://github.test",
      },
    } satisfies ComponentProps<typeof SocialLinks>;
    const result = await container.renderToString(SocialLinks, {
      props,
    });

    const listItems = [...result.matchAll(/<li.*?<\/li>/g)];

    expect(listItems).toHaveLength(Object.keys(props.links).length);
  });

  it<LocalTestContext>("does not render list items when the media are invalid", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      links: {
        foo: "https://foo.test",
        bar: "https://bar.test",
      },
    };
    const result = await container.renderToString(SocialLinks, {
      props,
    });

    const listItems = [...result.matchAll(/<li.*?<\/li>/g)];

    expect(listItems).toHaveLength(0);
  });

  it<LocalTestContext>("does not render list items when a link is undefined", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      links: {
        diaspora: "https://diaspora.test",
        github: undefined,
      },
    } satisfies ComponentProps<typeof SocialLinks>;
    const result = await container.renderToString(SocialLinks, {
      props,
    });

    const listItems = [...result.matchAll(/<li.*?<\/li>/g)];

    // Only diaspora
    expect(listItems).toHaveLength(1);
  });

  it<LocalTestContext>("can visually hide the labels", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      hideLabels: true,
      links: {
        diaspora: "https://diaspora.test",
        github: "https://github.test",
      },
    } satisfies ComponentProps<typeof SocialLinks>;
    const result = await container.renderToString(SocialLinks, {
      props,
    });

    expect(result).toContain("sr-only");
  });

  it<LocalTestContext>("can add the rel me attribute", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      addRelMe: true,
      links: {
        diaspora: "https://diaspora.test",
        github: "https://github.test",
      },
    } satisfies ComponentProps<typeof SocialLinks>;
    const result = await container.renderToString(SocialLinks, {
      props,
    });

    expect(result).toContain('rel="me"');
  });
});
