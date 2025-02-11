import { describe, expect, it, vi } from "vitest";
import { createImageMock } from "../../../../../tests/mocks/schema";
import { CONFIG } from "../../../../utils/constants";
import { pages } from "./pages";

vi.mock("../../../../utils/dates", async (importOriginal) => {
  const mod =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await importOriginal<typeof import("../../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date), // Mocked to return the input date
  };
});

const mockImage = createImageMock();

describe("pages", () => {
  it("should include the meta in the transformed output", () => {
    const page = {
      title: "The title of the page",
      description: "A description of the page.",
      isDraft: true,
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
      updatedOn: new Date("2023-01-02"),
    };

    if (typeof pages.schema !== "function")
      throw new Error("The schema is not callable");

    const parsedSchema = pages.schema({ image: mockImage });
    const result = parsedSchema.safeParse(page);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.isDraft).toBe(true);
      expect(result.data.meta.publishedOn).toEqual(new Date("2023-01-01"));
      expect(result.data.meta.updatedOn).toEqual(new Date("2023-01-02"));
    }
  });

  it("should apply default values as expected", () => {
    const page = {
      title: "The title of the page",
      description: "A description of the page.",
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
    };

    if (typeof pages.schema !== "function")
      throw new Error("The schema is not callable");

    const parsedSchema = pages.schema({ image: mockImage });
    const result = parsedSchema.safeParse(page);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe(CONFIG.LANGUAGES.DEFAULT);
      expect(result.data.meta.isDraft).toBe(false);
      expect(result.data.meta.updatedOn).toEqual(result.data.meta.publishedOn);
    }
  });
});
