import { describe, expect, it } from "vitest";
import { CONFIG } from "../../../utils/constants";
import { notes } from "./notes";

describe("notes", () => {
  it("should include the meta in the transformed output", () => {
    const note = {
      title: "The title of the note",
      description: "A description of the note.",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
      updatedOn: new Date("2023-01-02"),
    };

    if (!notes.schema || typeof notes.schema === "function")
      throw new Error("The schema is not accessible");

    const result = notes.schema.safeParse(note);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.isDraft).toBe(true);
      expect(result.data.meta.publishedOn).toEqual(new Date("2023-01-01"));
      expect(result.data.meta.updatedOn).toEqual(new Date("2023-01-02"));
    }
  });

  it("should apply default values as expected", () => {
    const note = {
      title: "The title of the note",
      description: "A description of the note.",
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
    };

    if (!notes.schema || typeof notes.schema === "function")
      throw new Error("The schema is not accessible");

    const result = notes.schema.safeParse(note);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe(CONFIG.LANGUAGES.DEFAULT);
      expect(result.data.meta.isDraft).toBe(false);
      expect(result.data.meta.updatedOn).toEqual(result.data.meta.publishedOn);
    }
  });
});
