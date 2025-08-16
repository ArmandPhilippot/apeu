import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLayoutMockEntries,
  createMockEntriesByCollection,
  mergeEntriesByCollection,
  setupCollectionMocks,
} from "../../../tests/helpers/astro-content";
import { clearEntriesIndexCache } from "../../lib/astro/collections/indexes";
import ContactView from "./contact-view.astro";

vi.mock("astro:content", async (importOriginal) => {
  const mod = await importOriginal<typeof import("astro:content")>();
  return {
    ...mod,
    getCollection: vi.fn(() => []),
    getEntry: vi.fn(),
  };
});

vi.mock("../../utils/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "es", "fr"],
      },
    },
  };
});

vi.mock("../../utils/i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../utils/i18n")>();
  return {
    ...mod,
    useI18n: vi.fn().mockReturnValue({
      locale: "en",
      translate: vi.fn().mockImplementation((key: string) => {
        const mockTranslations: Record<string, string> = {
          "no.js.contact.form.text": "No JS text",
        };

        return mockTranslations[key] ?? key;
      }),
      translatePlural: vi.fn(),
    }),
  };
});

type LocalTestContext = {
  container: AstroContainer;
};

function setupTestWithMockEntries(
  testEntries: Parameters<typeof createMockEntriesByCollection>[0]
) {
  const layoutEntries = createLayoutMockEntries(["en", "fr"]);
  const mockEntries = createMockEntriesByCollection(testEntries);
  const mergedMockEntries = mergeEntriesByCollection(
    layoutEntries,
    mockEntries
  );
  setupCollectionMocks(mergedMockEntries);
}

describe("ContactView", () => {
  beforeEach<LocalTestContext>(async (context) => {
    context.container = await AstroContainer.create();
    setupTestWithMockEntries({});
  });

  afterEach(() => {
    clearEntriesIndexCache();
    vi.clearAllMocks();
  });

  it<LocalTestContext>("renders a callout with a contact form", async ({
    container,
  }) => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const props = {
      entry: {
        Content: vi.fn().mockImplementation(() => null),
        collection: "pages",
        description: "The contact page view.",
        hasContent: false,
        headings: [],
        id: "en/contact",
        locale: "en",
        meta: {
          publishedOn: new Date(),
          updatedOn: new Date(),
        },
        route: "/contact",
        seo: {
          description: "",
          title: "Contact page",
        },
        slug: "contact",
        title: "Contact page",
      },
    } satisfies ComponentProps<typeof ContactView>;
    const result = await container.renderToString(ContactView, {
      props,
    });

    expect(result).toContain("warning");
    expect(result).toContain("No JS text");
    expect(result).toContain("contact-page-form");
  });
});
