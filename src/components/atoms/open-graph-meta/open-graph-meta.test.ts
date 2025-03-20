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
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

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

    const meta = [...result.matchAll(/<meta.*?property.*?>/g)];

    expect(meta).toHaveLength(Object.keys(props).length);
    expect(result).toContain(`content="${props.title}" property="og:title"`);
    expect(result).toContain(`content="${props.type}" property="og:type"`);
    expect(result).toContain(
      `content="${props.image.url}" property="og:image"`
    );
    expect(result).toContain(`content="${props.url}" property="og:url"`);
  });

  it<LocalTestContext>("can render a meta for the description", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(
      `content="${props.description}" property="og:description"`
    );
  });

  it<LocalTestContext>("can render a meta for the determiner", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(
      `content="${props.determiner}" property="og:determiner"`
    );
  });

  it<LocalTestContext>("can render a meta for the locale", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(`content="${props.locale}" property="og:locale"`);
  });

  it<LocalTestContext>("can render a meta for the locale with partial code", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(
      `content="${getLanguageTerritory(props.locale)}" property="og:locale"`
    );
  });

  it<LocalTestContext>("can render a meta for each alternate locale", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

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

    const altMeta = [
      ...result.matchAll(/<meta.*?property="og:locale:alternate"/g),
    ];

    expect(altMeta).toHaveLength(props.localesAlt.length);
    expect(result).toContain(`content="${props.localesAlt[0]}"`);
    expect(result).toContain(`content="${props.localesAlt[1]}"`);
  });

  it<LocalTestContext>("can render a meta for the site name", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(
      `content="${props.siteName}" property="og:site_name"`
    );
  });

  it<LocalTestContext>("can render additional meta using a slot", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(body);
  });
});
