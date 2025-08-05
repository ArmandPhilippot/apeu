import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  createMockEntries,
  setupCollectionMocks,
} from "../../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../../lib/astro/collections/indexes";
import PageLayout from "./page-layout.astro";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

vi.mock("../../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en"],
      },
    },
  };
});

vi.mock("../../../utils/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/i18n")>();
  return {
    ...mod,
    availableNamedLanguages: {
      en: "English",
    },
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("PageLayout", () => {
  beforeAll(() => {
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/home", data: { title: "Home" } },
      { collection: "pages", id: "en/blog", data: { title: "Blog" } },
      { collection: "pages", id: "en/blogroll", data: { title: "Blogroll" } },
      { collection: "pages", id: "en/bookmarks", data: { title: "Bookmarks" } },
      { collection: "pages", id: "en/contact", data: { title: "Contact" } },
      { collection: "pages", id: "en/feeds", data: { title: "Feeds" } },
      { collection: "pages", id: "en/guides", data: { title: "Guides" } },
      {
        collection: "pages",
        id: "en/legal-notice",
        data: { title: "Legal notice" },
      },
      { collection: "pages", id: "en/notes", data: { title: "Notes" } },
      { collection: "pages", id: "en/projects", data: { title: "Projects" } },
      { collection: "pages", id: "en/search", data: { title: "Search" } },
    ]);
    setupCollectionMocks(mockEntries);
  });

  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
  });

  afterAll(() => {
    clearEntriesIndexCache();
  });

  it<LocalTestContext>("renders the page", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

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

    expect(result).toContain("</main>");
    expect(result).toContain("</article>");
    expect(result).toContain(props.title);
    expect(result).toContain(props.seo.title);
  });

  it<LocalTestContext>("can render a breadcrumb", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

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

    expect(result).toContain(props.breadcrumb[0].label);
    expect(result).toContain(props.breadcrumb[1].label);
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Access to third item. */
    expect(result).toContain(props.breadcrumb[2].label);
  });

  it<LocalTestContext>("can render an aside", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(2);

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

    expect(result).toContain("</aside>");
    expect(result).toContain(aside);
  });

  it<LocalTestContext>("can render the page meta", async ({ container }) => {
    expect.assertions(1);

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

    expect(result).toContain(meta);
  });

  it<LocalTestContext>("can render the page body", async ({ container }) => {
    expect.assertions(1);

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

    expect(result).toContain(body);
  });

  it<LocalTestContext>("can render the page disconnected body", async ({
    container,
  }) => {
    expect.assertions(1);

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

    expect(result).toContain(disconnectedBody);
  });

  it<LocalTestContext>("can render the page footer", async ({ container }) => {
    expect.assertions(1);

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

    expect(result).toContain(footer);
  });
});
