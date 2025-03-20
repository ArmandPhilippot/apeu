import { describe, expect, it, vi } from "vitest";
import { createReferenceMock } from "../../../../../tests/mocks/references";
import { createImageMock } from "../../../../../tests/mocks/schema";
import { CONFIG } from "../../../../utils/constants";
import { blogPosts } from "./blog-posts";

vi.mock("../../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date), // Mocked to return the input date
  };
});

vi.mock("astro:content", async () => {
  const actual = await vi.importActual("astro:content");
  return {
    ...actual,
    reference: vi.fn((collection: string) => createReferenceMock(collection)),
  };
});

const mockImage = createImageMock();

describe("blogPosts", () => {
  it("should include the meta in the transformed output", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const post = {
      title: "The title of the post",
      description: "A description of the post.",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      authors: ["john-doe"],
      category: "foo-bar",
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
      updatedOn: new Date("2023-01-02"),
    };

    if (typeof blogPosts.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = blogPosts.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(post);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
    expect(result.data.meta.updatedOn).toStrictEqual(new Date("2023-01-02"));
  });

  it("should apply default values as expected", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const post = {
      title: "The title of the post",
      description: "A description of the post.",
      publishedOn: new Date("2023-01-01"),
      authors: ["john-doe"],
      category: "foo-bar",
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
    };

    if (typeof blogPosts.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = blogPosts.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(post);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.locale).toBe(CONFIG.LANGUAGES.DEFAULT);
    expect(result.data.meta.isDraft).toBe(false);
    expect(result.data.meta.updatedOn).toStrictEqual(
      result.data.meta.publishedOn
    );
  });
});
