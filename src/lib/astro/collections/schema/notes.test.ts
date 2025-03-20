import { describe, expect, it, vi } from "vitest";
import { CONFIG } from "../../../../utils/constants";
import { notes } from "./notes";

vi.mock("../../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date), // Mocked to return the input date
  };
});

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

    if (notes.schema === undefined || typeof notes.schema === "function") {
      throw new Error("The schema is not accessible");
    }

    const result = notes.schema.safeParse(note);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
    expect(result.data.meta.updatedOn).toStrictEqual(new Date("2023-01-02"));
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

    if (notes.schema === undefined || typeof notes.schema === "function") {
      throw new Error("The schema is not accessible");
    }

    const result = notes.schema.safeParse(note);

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
