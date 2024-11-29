import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../../utils/constants";
import { blogCategories } from "./blog-categories";

describe("blogCategories", () => {
  it("should include the meta in the transformed output", async () => {
    const category = {
      title: "The title of the category",
      description: "A description of the category.",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
      updatedOn: new Date("2023-01-02"),
    };

    if (typeof blogCategories.schema !== "function")
      throw new Error("The schema is not callable");

    const parsedSchema = blogCategories.schema({ image: vi.fn() });
    const result = await parsedSchema.safeParseAsync(category);

    expect.assertions(4);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.isDraft).toBe(true);
      expect(result.data.meta.publishedOn).toEqual(new Date("2023-01-01"));
      expect(result.data.meta.updatedOn).toEqual(new Date("2023-01-02"));
    }
  });

  it("should apply default values as expected", async () => {
    const category = {
      title: "The title of the category",
      description: "A description of the category.",
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
    };

    if (typeof blogCategories.schema !== "function")
      throw new Error("The schema is not callable");

    const parsedSchema = blogCategories.schema({ image: vi.fn() });
    const result = await parsedSchema.safeParseAsync(category);

    expect.assertions(4);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe(CONFIG.LANGUAGES.DEFAULT);
      expect(result.data.meta.isDraft).toBe(false);
      expect(result.data.meta.updatedOn).toEqual(result.data.meta.publishedOn);
    }
  });
});
