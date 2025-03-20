import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SocialLink from "./social-link.astro";

vi.mock("../../../utils/i18n", async () => {
  const originalModule = await vi.importActual("../../../utils/i18n");
  return {
    ...originalModule,
    useI18n: vi.fn(() => {
      return {
        locale: "en",
        translate: (key: string) => `translated_${key}`,
        translatePlural: (key: string, { count }: { count: number }) =>
          `translated_${key}_${count}`,
      };
    }),
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("SocialLink", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders a link to a social medium", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      medium: "diaspora",
      url: "https://example.test",
    } satisfies ComponentProps<typeof SocialLink>;
    const result = await container.renderToString(SocialLink, {
      props,
    });

    expect(result).toContain(`href="${props.url}"`);
    expect(result).toContain(`translated_social.medium.label.${props.medium}`);
  });

  it<LocalTestContext>("can visually hide the label", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      hideLabel: true,
      medium: "diaspora",
      url: "https://example.test",
    } satisfies ComponentProps<typeof SocialLink>;
    const result = await container.renderToString(SocialLink, {
      props,
    });

    expect(result).toContain("sr-only");
    expect(result).toContain('data-label="false"');
  });

  it<LocalTestContext>("can use a custom label", async ({ container }) => {
    expect.assertions(1);

    const props = {
      label: "vero labore nihil",
      medium: "diaspora",
      url: "https://example.test",
    } satisfies ComponentProps<typeof SocialLink>;
    const result = await container.renderToString(SocialLink, {
      props,
    });

    expect(result).toContain(props.label);
  });
});
