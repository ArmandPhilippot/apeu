import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import PageLayout from "./page-layout.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("PageLayout", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the page", async ({ container }) => {
    const props = {
      description: "Porro iste voluptatem architecto iste pariatur atque non.",
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const result = await container.renderToString(PageLayout, {
      props,
    });

    expect.assertions(4);

    expect(result).toContain("</main>");
    expect(result).toContain("</article>");
    expect(result).toContain(props.title);
    expect(result).toContain(props.seo.title);
  });

  it<LocalTestContext>("can render a breadcrumb", async ({ container }) => {
    const props = {
      breadcrumb: [
        { label: "omnis assumenda aut", url: "#voluptate-est-sed" },
        { label: "voluptas odio voluptatem", url: "#est-ducimus-sit" },
        { label: "sunt ratione quis", url: "#sunt-illo-iusto" },
      ] as const,
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const result = await container.renderToString(PageLayout, {
      props,
    });

    expect.assertions(3);

    expect(result).toContain(props.breadcrumb[0].label);
    expect(result).toContain(props.breadcrumb[1].label);
    expect(result).toContain(props.breadcrumb[2].label);
  });

  it<LocalTestContext>("can render an aside", async ({ container }) => {
    const props = {
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const aside = "aut sed assumenda";
    const result = await container.renderToString(PageLayout, {
      props,
      slots: { aside },
    });

    expect.assertions(2);

    expect(result).toContain("</aside>");
    expect(result).toContain(aside);
  });

  it<LocalTestContext>("can render the page meta", async ({ container }) => {
    const props = {
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const meta = "aut sed assumenda";
    const result = await container.renderToString(PageLayout, {
      props,
      slots: { meta },
    });

    expect.assertions(1);

    expect(result).toContain(meta);
  });

  it<LocalTestContext>("can render the page body", async ({ container }) => {
    const props = {
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const body = "aut sed assumenda";
    const result = await container.renderToString(PageLayout, {
      props,
      slots: { body },
    });

    expect.assertions(1);

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render the page disconnected body", async ({
    container,
  }) => {
    const props = {
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const disconnectedBody = "aut sed assumenda";
    const result = await container.renderToString(PageLayout, {
      props,
      slots: { "disconnected-body": disconnectedBody },
    });

    expect.assertions(1);

    expect(result).toContain(disconnectedBody);
  });

  it<LocalTestContext>("can render the page footer", async ({ container }) => {
    const props = {
      seo: {
        title: "est et fugiat",
      },
      title: "sunt quos molestiae",
    } satisfies ComponentProps<typeof PageLayout>;
    const footer = "aut sed assumenda";
    const result = await container.renderToString(PageLayout, {
      props,
      slots: { footer },
    });

    expect.assertions(1);

    expect(result).toContain(footer);
  });
});
