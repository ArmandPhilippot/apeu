import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import {
  afterAll,
  afterEach,
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
import Layout from "./layout.astro";

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
        AVAILABLE: ["en", "es", "fr"],
      },
    },
    LOCALE_DISPLAY_NAMES: {
      en: "English",
    },
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

describe("Layout", () => {
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

  afterEach<LocalTestContext>(() => {
    vi.unstubAllEnvs();
  });

  afterAll(() => {
    clearEntriesIndexCache();
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
});
