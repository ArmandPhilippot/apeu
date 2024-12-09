import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import { getLanguageTerritory } from "../../../utils/i18n";
import OpenGraphMeta from "./open-graph-meta.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("OpenGraphMeta", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders the required meta", async ({ container }) => {
    const props = {
      image: {
        url: "/quia-facere-facere",
      },
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(5);

    const meta = [...result.matchAll(/<meta property(?:.*?)>/g)];

    expect(meta).toHaveLength(Object.keys(props).length);
    expect(result).toContain(`property="og:title" content="${props.title}"`);
    expect(result).toContain(`property="og:type" content="${props.type}"`);
    expect(result).toContain(
      `property="og:image" content="${props.image.url}"`,
    );
    expect(result).toContain(`property="og:url" content="${props.url}"`);
  });

  it<LocalTestContext>("can render a meta for the description", async ({
    container,
  }) => {
    const props = {
      description: "Eos non quis voluptatem.",
      image: {
        url: "/quia-facere-facere",
      },
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="og:description" content="${props.description}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the determiner", async ({
    container,
  }) => {
    const props = {
      determiner: "auto",
      image: {
        url: "/quia-facere-facere",
      },
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="og:determiner" content="${props.determiner}"`,
    );
  });

  it<LocalTestContext>("can render a meta for the locale", async ({
    container,
  }) => {
    const props = {
      image: {
        url: "/quia-facere-facere",
      },
      locale: "en_US",
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(`property="og:locale" content="${props.locale}"`);
  });

  it<LocalTestContext>("can render a meta for the locale with partial code", async ({
    container,
  }) => {
    const props = {
      image: {
        url: "/quia-facere-facere",
      },
      locale: "en",
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="og:locale" content="${getLanguageTerritory(props.locale)}"`,
    );
  });

  it<LocalTestContext>("can render a meta for each alternate locale", async ({
    container,
  }) => {
    const props = {
      image: {
        url: "/quia-facere-facere",
      },
      localesAlt: ["fr_FR", "es_ES"],
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(3);

    const altMeta = [
      ...result.matchAll(/<meta property="og:locale:alternate"/g),
    ];

    expect(altMeta).toHaveLength(props.localesAlt.length);
    expect(result).toContain(`content="${props.localesAlt[0]}"`);
    expect(result).toContain(`content="${props.localesAlt[1]}"`);
  });

  it<LocalTestContext>("can render a meta for the site name", async ({
    container,
  }) => {
    const props = {
      image: {
        url: "/quia-facere-facere",
      },
      siteName: "ipsam eius omnis",
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const result = await container.renderToString(OpenGraphMeta, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain(
      `property="og:site_name" content="${props.siteName}"`,
    );
  });

  it<LocalTestContext>("can render additional meta using a slot", async ({
    container,
  }) => {
    const props = {
      image: {
        url: "/quia-facere-facere",
      },
      title: "praesentium iure a",
      type: "article",
      url: "/omnis-ut-voluptas",
    } satisfies ComponentProps<typeof OpenGraphMeta>;
    const body = "beatae ducimus eaque";
    const result = await container.renderToString(OpenGraphMeta, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(body);
  });
});
