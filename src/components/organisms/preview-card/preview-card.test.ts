import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PreviewCard from "./preview-card.astro";

vi.mock("../../../services/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../services/i18n")>();
  return {
    ...mod,
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

describe("PreviewCard", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders basic card with required props", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      entry: {
        description: "Test description",
        heading: "Test Post",
      },
    } satisfies ComponentProps<typeof PreviewCard>;

    const result = await container.renderToString(PreviewCard, { props });

    expect(result).toContain(props.entry.description);
    expect(result).toContain(props.entry.heading);
  });

  it<LocalTestContext>("renders card with featured meta", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      entry: {
        description: "Test description",
        featuredMeta: { label: "Featured", values: ["featured value"] },
        heading: "Test Post",
      },
    } satisfies ComponentProps<typeof PreviewCard>;

    const result = await container.renderToString(PreviewCard, { props });

    expect(result).toContain("Featured");
    expect(result).toContain("featured value");
  });

  it<LocalTestContext>("renders card CTAs", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      entry: {
        cta: [
          {
            label: "Read More",
            path: "#read-more",
          },
          {
            label: "Subscribe",
            path: "#subscribe",
          },
        ],
        description: "Test description",
        heading: "Test Post",
      },
    } satisfies ComponentProps<typeof PreviewCard>;

    const result = await container.renderToString(PreviewCard, { props });

    expect(result).toContain(props.entry.cta[0]?.label);
    expect(result).toContain(props.entry.cta[0]?.path);
    expect(result).toContain(props.entry.cta[1]?.label);
    expect(result).toContain(props.entry.cta[1]?.path);
  });

  it<LocalTestContext>("renders card with cover image", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      entry: {
        cover: {
          src: {
            format: "webp",
            height: 480,
            src: "/test-image.jpg",
            width: 640,
          },
          alt: "Test Image",
        },
        description: "Test description",
        heading: "Test Post",
      },
    } satisfies ComponentProps<typeof PreviewCard>;

    const result = await container.renderToString(PreviewCard, { props });

    expect(result).toContain("test-image.jpg");
    // Decorative image, so the alt should be replaced
    expect(result).not.toContain('alt="Test Image"');
    expect(result).toContain('width="640"');
    expect(result).toContain('height="480"');
  });

  it<LocalTestContext>("sets correct heading level", async ({ container }) => {
    expect.assertions(1);

    const props = {
      entry: {
        description: "Test description",
        heading: "Test Post",
      },
      headingLvl: "h3",
    } satisfies ComponentProps<typeof PreviewCard>;

    const result = await container.renderToString(PreviewCard, { props });

    expect(result).toContain("<h3");
  });
});
