import { z } from "astro:content";

export function createReferenceMock(collection: string) {
  return z.string().transform((slug) => ({
    collection,
    slug,
    data: {
      name: `Mock ${collection} ${slug}`,
    },
  }));
}
