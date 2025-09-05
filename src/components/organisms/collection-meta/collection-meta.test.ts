import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CollectionMeta from "./collection-meta.astro";

vi.mock("../../../services/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../services/i18n")>();
  return {
    ...mod,
    useI18n: vi.fn(() => {
      return {
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

describe("CollectionMeta", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  it<LocalTestContext>("renders nothing when no data is provided", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      data: {},
    } satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    const terms = [...result.matchAll(/<dt.*?<\/dt>/g)];

    expect(terms).toHaveLength(0);
  });

  it<LocalTestContext>("renders kind metadata correctly", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      data: {
        kind: "site",
      },
    } satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain("translated_meta.value.project.kind.site");
  });

  it<LocalTestContext>("renders date metadata correctly", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      data: {
        publishedOn: new Date("2024-01-01"),
      },
    } satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain('datetime="2024-01-01T00:00:00.000Z"');
  });

  it<LocalTestContext>("renders authors correctly with and without websites", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      data: {
        authors: [
          {
            name: "John Doe",
            website: "https://johndoe.com",
            isWebsiteOwner: false,
          },
          { name: "Jane Smith", isWebsiteOwner: true },
        ],
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain(`href="${props.data.authors[0].website}"`);
    expect(result).toContain(props.data.authors[0].name);
    expect(result).toContain(props.data.authors[1].name);
    // Check that Jane Smith is not wrapped in a link
    expect(result).not.toMatch(/<a[^>]*>Jane Smith<\/a>/);
  });

  it<LocalTestContext>("renders tags with correct links", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      data: {
        tags: [
          { label: "JavaScript", path: "/tags/javascript" },
          { label: "TypeScript", path: "/tags/typescript" },
        ],
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain(`href="${props.data.tags[0].path}"`);
    expect(result).toContain(`href="${props.data.tags[1].path}"`);
    expect(result).toContain(`>${props.data.tags[0].label}<`);
    expect(result).toContain(`>${props.data.tags[1].label}<`);
  });

  it<LocalTestContext>("renders multiple metadata types together", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      data: {
        kind: "site",
        publishedOn: new Date("2024-01-01"),
        authors: [
          {
            name: "John Doe",
            website: "https://johndoe.com",
            isWebsiteOwner: false,
          },
        ],
        tags: [{ label: "JavaScript", path: "/tags/javascript" }],
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain("translated_meta.value.project.kind.site");
    expect(result).toContain('datetime="2024-01-01T00:00:00.000Z"');
    expect(result).toContain('href="https://johndoe.com"');
    expect(result).toContain('href="/tags/javascript"');
  });

  it<LocalTestContext>("hides labels when hideLabel is true", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      data: {
        kind: "site",
      },
      hideLabel: true,
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain('class="sr-only"');
  });

  it<LocalTestContext>("shows update date when different from publish date", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      data: {
        publishedOn: new Date("2024-01-01"),
        updatedOn: new Date("2024-02-01"),
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    const timeMatches = result.match(/<time/g);

    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect(timeMatches).toHaveLength(2);
  });

  it<LocalTestContext>("does not show update date when equal to publish date", async ({
    container,
  }) => {
    expect.assertions(1);

    const props = {
      data: {
        publishedOn: new Date("2024-01-01"),
        updatedOn: new Date("2024-01-01"),
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    const timeMatches = result.match(/<time/g);

    expect(timeMatches).toHaveLength(1);
  });

  it<LocalTestContext>("renders single language correctly", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      data: {
        inLanguage: "en",
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain("translated_meta.label.language");
    expect(result).toContain("translated_language.name.en");
  });

  it<LocalTestContext>("renders multiple languages correctly", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const props = {
      data: {
        inLanguages: ["en", "fr", "es"],
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain("translated_meta.label.languages");
    expect(result).toContain("translated_language.name.en");
    expect(result).toContain("translated_language.name.fr");
    expect(result).toContain("translated_language.name.es");
  });

  it<LocalTestContext>("renders repository link correctly", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      data: {
        repository: {
          name: "repo",
          url: "https://github.com/user/repo",
        },
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain(`href="${props.data.repository.url}"`);
    expect(result).toContain(`>${props.data.repository.name}<`);
  });

  it<LocalTestContext>("renders category with correct link", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      data: {
        category: {
          label: "Development",
          path: "/category/development",
        },
      },
    } as const satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain(`href="${props.data.category.path}"`);
    expect(result).toContain(`>${props.data.category.label}<`);
  });

  it<LocalTestContext>("renders total metadata correctly", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

    const props = {
      data: {
        total: "nobis sint error",
      },
    } satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain("translated_meta.label.total");
    expect(result).toContain(props.data.total);
  });

  it<LocalTestContext>("renders reading time metadata correctly", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      data: {
        readingTime: {
          inMinutes: 1,
          inMinutesAndSeconds: {
            minutes: 1,
            seconds: 23,
          },
          wordsCount: 114,
          wordsPerMinute: 25,
        },
      },
    } satisfies ComponentProps<typeof CollectionMeta>;
    const result = await container.renderToString(CollectionMeta, {
      props,
    });

    expect(result).toContain("translated_meta.label.reading.time");
    expect(result).toContain("translated_meta.value.reading.time.in.minutes");
    expect(result).toContain("translated_meta.description.reading.time");
  });
});
