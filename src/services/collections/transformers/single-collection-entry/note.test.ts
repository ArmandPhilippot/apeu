import { describe, expect, it, vi } from "vitest";
import { createMockI18n } from "../../../../../tests/helpers/i18n";
import type { QueriedEntry } from "../../types";
import { convertNoteToPreview } from "./note";

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

const createNoteEntry = (overrides = {}): QueriedEntry<"notes", "preview"> => {
  return {
    title: "Test Note",
    description: "Note description",
    route: "/notes/test-note",
    // @ts-expect-error - Mock data doesn't need complete meta structure
    meta: { publishedOn: new Date("2024-01-01") },
    ...overrides,
  };
};

describe("convertNoteToPreview", () => {
  it("should use internal route", () => {
    const entry = createNoteEntry();
    const i18n = createMockI18n();
    const result = convertNoteToPreview(entry, {
      i18n,
      showCta: false,
    });

    expect(result.heading).toStrictEqual({
      label: "Test Note",
      path: "/notes/test-note",
    });
  });
});
