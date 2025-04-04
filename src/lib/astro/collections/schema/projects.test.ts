import { describe, expect, it, vi } from "vitest";
import { createImageMock } from "../../../../../tests/mocks/schema";
import { CONFIG } from "../../../../utils/constants";
import { projects } from "./projects";

vi.mock("../../../../utils/dates", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../../../utils/dates")>();

  return {
    ...mod,
    applyTimezone: vi.fn((date) => date), // Mocked to return the input date
  };
});

const mockImage = createImageMock();

describe("projects", () => {
  it("should include the meta in the transformed output", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(4);

    const project = {
      title: "The title of the project",
      description: "A description of the project.",
      isDraft: true,
      kind: "app",
      publishedOn: new Date("2023-01-01"),
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
      updatedOn: new Date("2023-01-02"),
    };

    if (typeof projects.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = projects.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(project);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.meta.isDraft).toBe(true);
    expect(result.data.meta.publishedOn).toStrictEqual(new Date("2023-01-01"));
    expect(result.data.meta.updatedOn).toStrictEqual(new Date("2023-01-02"));
  });

  it("should apply default values as expected", async () => {
    /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
    expect.assertions(5);

    const project = {
      title: "The title of the project",
      description: "A description of the project.",
      publishedOn: new Date("2023-01-01"),
      kind: "app",
      seo: {
        title: "qui sit vero",
        description: "Vel voluptatem laboriosam.",
      },
    };

    if (typeof projects.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = projects.schema({ image: mockImage });
    const result = await parsedSchema.safeParseAsync(project);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.locale).toBe(CONFIG.LANGUAGES.DEFAULT);
    expect(result.data.meta.isArchived).toBe(false);
    expect(result.data.meta.isDraft).toBe(false);
    expect(result.data.meta.updatedOn).toStrictEqual(
      result.data.meta.publishedOn
    );
  });
});
