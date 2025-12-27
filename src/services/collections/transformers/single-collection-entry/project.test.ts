import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertProjectToPreview } from "./project";

vi.mock("../../../../utils/constants", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("../../../../utils/constants")>();
  return {
    ...mod,
    CONFIG: {
      ...mod.CONFIG,
      LANGUAGES: {
        DEFAULT: "en",
        AVAILABLE: ["en", "fr"],
      },
    },
  };
});

const createProjectEntry = (
  overrides = {}
): QueriedEntry<"projects", "preview"> => {
  return {
    title: "Test Project",
    description: "Project description",
    route: "/projects/test-project",
    cover: { src: "/images/project.jpg", alt: "Project" },
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: { publishedOn: new Date("2024-01-01") },
    ...overrides,
  };
};

describe("convertProjectToPreview", () => {
  it("should use discover CTA instead of read more", () => {
    const entry = createProjectEntry();
    const i18n = createMockI18n();
    const result = convertProjectToPreview(entry, {
      i18n,
      showCta: true,
    });

    expect(result.cta?.[0]?.label).toBe("cta.discover");
    expect(i18n.translate).toHaveBeenCalledWith("cta.discover.a11y", {
      title: "Test Project",
    });
  });

  it("should support cover", () => {
    const entry = createProjectEntry();
    const i18n = createMockI18n();
    const result = convertProjectToPreview(entry, {
      i18n,
      showCover: true,
    });

    expect(result.cover).toStrictEqual({
      src: "/images/project.jpg",
      alt: "Project",
    });
  });
});
