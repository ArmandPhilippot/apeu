import { describe, expect, it } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { contentsBaseSchema, locale, seo } from "./utils";

describe("locale", () => {
  it("should validate the given locale", () => {
    const input = CONFIG.LANGUAGES.DEFAULT;
    const result = locale.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(input);
    }
  });

  it("should use the default locale by default", () => {
    const result = locale.safeParse(undefined);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(CONFIG.LANGUAGES.DEFAULT);
    }
  });

  it("should fail if the given locale is not supported", () => {
    const result = locale.safeParse("foo");

    expect(result.success).toBe(false);
  });
});

describe("seo", () => {
  it("should validate the given seo object", () => {
    const input = {
      title: "A title",
      description: "A description.",
    };
    const result = seo.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe(input.title);
      expect(result.data.description).toBe(input.description);
    }
  });
});

describe("contentsBaseSchema", () => {
  it("should apply default values as expected", () => {
    const content = {
      title: "The title of the content",
      description: "A description of the content.",
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
    };

    const result = contentsBaseSchema.safeParse(content);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe(CONFIG.LANGUAGES.DEFAULT);
      expect(result.data.isDraft).toBe(false);
      expect(result.data.updatedOn).toBeUndefined();
      expect(result.data.slug).toBeUndefined();
    }
  });
});
