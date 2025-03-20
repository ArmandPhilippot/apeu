import { z } from "astro:content";
import type { ZodEffects, ZodString } from "zod";

type ReferenceMock = ZodEffects<
  ZodString,
  { collection: string; slug: string; data: { name: string } },
  string
>;

/**
 * Create a mock for a collection reference.
 *
 * @param {string} collection - The collection name.
 * @returns {ReferenceMock} The mocked reference.
 */
export function createReferenceMock(collection: string): ReferenceMock {
  return z.string().transform((slug) => {
    return {
      collection,
      slug,
      data: {
        name: `Mock ${collection} ${slug}`,
      },
    };
  });
}
