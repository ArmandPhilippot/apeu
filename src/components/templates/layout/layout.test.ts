import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Layout from "./layout.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Layout", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterEach<LocalTestContext>(() => {
    vi.unstubAllEnvs();
  });

  it<LocalTestContext>("renders the website structure", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Layout>;
    const result = await container.renderToString(Layout, {
      props,
    });

    expect(result).toContain("</head>");
    expect(result).toContain("</header>");
    expect(result).toContain("</footer>");
    expect(result).toContain("</body>");
  });

  it<LocalTestContext>("can render its children using a slot", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Layout>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Layout, {
      props,
      slots: { default: body },
    });

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a link to the design system in dev mode", async ({
    container,
  }) => {
    expect.assertions(1);

    vi.stubEnv("MODE", "development");

    const props = {
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Layout>;
    const result = await container.renderToString(Layout, {
      props,
    });

    expect(result).toContain("/design-system");
  });

  it<LocalTestContext>("does not render a link to the design system in other modes than dev", async ({
    container,
  }) => {
    expect.assertions(1);

    vi.stubEnv("MODE", "production");
    vi.stubEnv("DEV", false);

    const props = {
      seo: {
        title: "est et fugiat",
      },
    } satisfies ComponentProps<typeof Layout>;
    const result = await container.renderToString(Layout, {
      props,
    });

    expect(result).not.toContain("/design-system");
  });
});
