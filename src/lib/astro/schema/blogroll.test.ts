import { describe, expect, it, vi } from "vitest";
import { createImageMock } from "../../../../tests/mocks/schema";
import { blogroll } from "./blogroll";

vi.mock("../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date),
  };
});

const mockImage = createImageMock();

describe("blogroll", () => {
  it("should include the meta in the transformed output", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const blog = {
      title: "The title of the blog",
      description: {
        en: "A description of the blog.",
      },
      inLanguages: ["es"],
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      updatedOn: new Date("2023-01-02"),
      url: "https://example.test",
    };

    if (typeof blogroll.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = blogroll.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(blog);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.inLanguages).toStrictEqual(blog.inLanguages);
    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
    expect(result.data.meta.updatedOn).toStrictEqual(new Date("2023-01-02"));
  });

  it("should apply default values as expected", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(3);

    const blog = {
      title: "The title of the blog",
      description: {
        en: "A description of the blog.",
      },
      inLanguages: ["en"],
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
    };

    if (typeof blogroll.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = blogroll.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(blog);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.isDraft).toBe(false);
    expect(result.data.meta.updatedOn).toStrictEqual(
      result.data.meta.publishedOn
    );
  });
});
