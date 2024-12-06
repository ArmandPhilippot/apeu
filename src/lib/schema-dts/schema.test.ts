import { describe, expect, it } from "vitest";
import { getJsonLdSchema } from "./schema";

describe("get-json-ld-schema", () => {
  it("returns the structured data from graphs", () => {
    const schema = getJsonLdSchema([
      {
        "@type": "AboutPage",
        name: "voluptas fugiat eveniet",
      },
    ]);

    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "AboutPage",
            "name": "voluptas fugiat eveniet",
          },
        ],
      }
    `);
  });
});
