import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Layout from "./layout.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Layout", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
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

    expect.assertions(2);

    expect(result).toContain("</head>");
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
});
