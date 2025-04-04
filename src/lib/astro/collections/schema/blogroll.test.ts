import { describe, expect, it, vi } from "vitest";
import { blogroll } from "./blogroll";

vi.mock("../../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date), // Mocked to return the input date
  };
});

describe("blogroll", () => {
  it("should include the meta in the transformed output", () => {
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

    if (
      blogroll.schema === undefined ||
      typeof blogroll.schema === "function"
    ) {
      throw new Error("The schema is not accessible");
    }

    const result = blogroll.schema.safeParse(blog);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.inLanguages).toStrictEqual(blog.inLanguages);
    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
    expect(result.data.meta.updatedOn).toStrictEqual(new Date("2023-01-02"));
  });

  it("should apply default values as expected", () => {
    const blog = {
      title: "The title of the blog",
      description: {
        en: "A description of the blog.",
      },
      inLanguages: ["en"],
      publishedOn: new Date("2023-01-01"),
      url: "https://example.test",
    };

    if (
      blogroll.schema === undefined ||
      typeof blogroll.schema === "function"
    ) {
      throw new Error("The schema is not accessible");
    }

    const result = blogroll.schema.safeParse(blog);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.isDraft).toBe(false);
    expect(result.data.meta.updatedOn).toStrictEqual(
      result.data.meta.publishedOn
    );
  });
});
