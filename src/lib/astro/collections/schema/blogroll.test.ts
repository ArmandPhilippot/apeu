import { describe, expect, it } from "vitest";
import { blogroll } from "./blogroll";

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

    if (!blogroll.schema || typeof blogroll.schema === "function")
      throw new Error("The schema is not accessible");

    const result = blogroll.schema.safeParse(blog);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.inLanguages).toStrictEqual(blog.inLanguages);
      expect(result.data.meta.isDraft).toBe(true);
      expect(result.data.meta.publishedOn).toEqual(new Date("2023-01-01"));
      expect(result.data.meta.updatedOn).toEqual(new Date("2023-01-02"));
    }
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

    if (!blogroll.schema || typeof blogroll.schema === "function")
      throw new Error("The schema is not accessible");

    const result = blogroll.schema.safeParse(blog);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.isDraft).toBe(false);
      expect(result.data.meta.updatedOn).toEqual(result.data.meta.publishedOn);
    }
  });
});
