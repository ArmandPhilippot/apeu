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
import Navbar from "./navbar.astro";

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

describe("Navbar", () => {
  beforeAll(() => {
    const mockEntries = createMockEntries([
      { collection: "pages", id: "en/search", data: { title: "Search" } },
      {
        collection: "pages",
        id: "en/recherche",
        data: { title: "Recherche" },
      },
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

  it<LocalTestContext>("renders the navbar", async ({ container }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      altLanguages: null,
      mainNav: [],
    } satisfies ComponentProps<typeof Navbar>;
    const result = await container.renderToString(Navbar, {
      props,
    });

    expect(result).toContain("navbar-menu-modal");
    expect(result).toContain("navbar-search-modal");
    expect(result).toContain("navbar-settings-modal");
  });
});
