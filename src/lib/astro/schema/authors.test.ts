import { z } from "astro/zod";
import { describe, expect, it, vi } from "vitest";
import { authors } from "./authors";

const mockImage = vi.fn().mockReturnValue(
  z.object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.union([
      z.literal("png"),
      z.literal("jpg"),
      z.literal("jpeg"),
      z.literal("tiff"),
      z.literal("webp"),
      z.literal("gif"),
      z.literal("svg"),
      z.literal("avif"),
    ]),
  })
);

describe("authors", () => {
  it("should include the full name in the transformed output", () => {
    const author = {
      firstName: "John",
      lastName: "Doe",
      isWebsiteOwner: true,
    };

    if (typeof authors.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = authors.schema({ image: mockImage });
    const result = parsedSchema.safeParse(author);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.isWebsiteOwner).toBe(true);
    expect(result.data.name).toStrictEqual(
      `${author.firstName} ${author.lastName}`
    );
    expect(result.data.nameIPA).not.toBeDefined();
  });

  it("should apply default values as expected", () => {
    const author = {
      firstName: "John",
      lastName: "Doe",
    };

    if (typeof authors.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = authors.schema({ image: mockImage });
    const result = parsedSchema.safeParse(author);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.isWebsiteOwner).toBe(false);
  });

  it("can combine both IPA transcriptions in the transformed output", () => {
    const author = {
      firstName: "John",
      // cSpell:ignore ˈdʒɑn
      firstNameIPA: "/ˈdʒɑn/",
      lastName: "Doe",
      // cSpell:ignore ˈdoʊ
      lastNameIPA: "/ˈdoʊ/",
    };

    if (typeof authors.schema !== "function") {
      throw new TypeError("The schema is not callable");
    }

    const parsedSchema = authors.schema({ image: mockImage });
    const result = parsedSchema.safeParse(author);

    expect(result.success).toBe(true);

    // This guards against TypeScript errors but won't execute if the test is passing
    if (!result.success) return;

    expect(result.data.nameIPA).toStrictEqual(
      `${author.firstNameIPA} ${author.lastNameIPA}`
    );
  });
});
