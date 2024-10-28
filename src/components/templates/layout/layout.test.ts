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
    const props = {
      title: "et ratione dolor",
    } satisfies ComponentProps<typeof Layout>;
    const result = await container.renderToString(Layout, {
      props,
    });

    expect.assertions(5);

    expect(result).toContain("</head>");
    expect(result).toContain("</header>");
    expect(result).toContain(props.title);
    expect(result).toContain("</footer>");
    expect(result).toContain("</body>");
  });

  it<LocalTestContext>("can render its children using a slot", async ({
    container,
  }) => {
    const props = {
      title: "et ratione dolor",
    } satisfies ComponentProps<typeof Layout>;
    const body = "id quibusdam eius";
    const result = await container.renderToString(Layout, {
      props,
      slots: { default: body },
    });

    expect.assertions(1);

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render a link to the design system in dev mode", async ({
    container,
  }) => {
    vi.stubEnv("MODE", "development");

    const props = {
      title: "et ratione dolor",
    } satisfies ComponentProps<typeof Layout>;
    const result = await container.renderToString(Layout, {
      props,
    });

    expect.assertions(1);

    expect(result).toContain("/design-system");
  });

  it<LocalTestContext>("does not render a link to the design system in other modes than dev", async ({
    container,
  }) => {
    vi.stubEnv("MODE", "production");
    vi.stubEnv("DEV", false);

    const props = {
      title: "et ratione dolor",
    } satisfies ComponentProps<typeof Layout>;
    const result = await container.renderToString(Layout, {
      props,
    });

    expect.assertions(1);

    expect(result).not.toContain("/design-system");
  });
});
