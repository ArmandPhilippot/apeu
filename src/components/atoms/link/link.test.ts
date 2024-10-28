import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it } from "vitest";
import Link from "./link.astro";

type LocalTestContext = {
  container: AstroContainer;
};

describe("Link", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a link", async ({ container }) => {
    const props = {
      href: "#perferendis-omnis-atque",
    } satisfies ComponentProps<typeof Link>;
    const anchor = "id quibusdam eius";
    const result = await container.renderToString(Link, {
      props,
      slots: { default: anchor },
    });

    expect.assertions(2);

    expect(result).toContain(anchor);
    expect(result).toContain(props.href);
  });

  it<LocalTestContext>("can render a download link", async ({ container }) => {
    const props = {
      href: "#perferendis-omnis-atque",
      isDownload: true,
    } satisfies ComponentProps<typeof Link>;
    const anchor = "id quibusdam eius";
    const result = await container.renderToString(Link, {
      props,
      slots: { default: anchor },
    });

    expect.assertions(1);

    expect(result).toContain("download");
  });

  it<LocalTestContext>("can render an external link using rel", async ({
    container,
  }) => {
    const props = {
      href: "#perferendis-omnis-atque",
      rel: "external",
    } satisfies ComponentProps<typeof Link>;
    const anchor = "id quibusdam eius";
    const result = await container.renderToString(Link, {
      props,
      slots: { default: anchor },
    });

    expect.assertions(1);

    expect(result).toContain("external");
  });

  it<LocalTestContext>("can render an external link using isExternal", async ({
    container,
  }) => {
    const props = {
      href: "#perferendis-omnis-atque",
      isExternal: true,
    } satisfies ComponentProps<typeof Link>;
    const anchor = "id quibusdam eius";
    const result = await container.renderToString(Link, {
      props,
      slots: { default: anchor },
    });

    expect.assertions(1);

    expect(result).toContain("external");
  });

  it<LocalTestContext>("can render an external link using isExternal and add rel external if missing", async ({
    container,
  }) => {
    const props = {
      href: "#perferendis-omnis-atque",
      isExternal: true,
      rel: "nofollow",
    } satisfies ComponentProps<typeof Link>;
    const anchor = "id quibusdam eius";
    const result = await container.renderToString(Link, {
      props,
      slots: { default: anchor },
    });

    expect.assertions(1);

    expect(result).toContain("external");
  });
});
