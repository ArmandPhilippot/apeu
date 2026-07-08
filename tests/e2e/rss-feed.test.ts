import { expect, test } from "@playwright/test";
import en from "../../src/translations/en.json" with { type: "json" };
import fr from "../../src/translations/fr.json" with { type: "json" };

const XML_CONTENT_TYPE = "application/xml";
const SITE_URL = "https://armand.philippot.eu";
const HTTP_OK = 200;

/**
 * XML-escape the handful of predefined entities `@astrojs/rss` relies on,
 * matching how it serializes the feed's title/description text nodes.
 *
 * @param {string} text - The raw text to escape.
 * @returns {string} The escaped text.
 */
const escapeXml = (text: string): string => text.replaceAll("'", "&apos;");

test.describe("RSS feed", () => {
  test("serves the global French feed as valid RSS", async ({ request }) => {
    const response = await request.get("/feed.xml");

    expect(response.status()).toBe(HTTP_OK);
    expect(response.headers()["content-type"]).toContain(XML_CONTENT_TYPE);

    const body = await response.text();

    expect(body).toContain("<rss");
    expect(body).toContain(
      `<title>${escapeXml(fr["feed.website.title"])}</title>`
    );
    expect(body).toContain(`<atom:link href="${SITE_URL}/feed.xml" rel="self"`);
    expect(body.match(/<item>/g)?.length ?? 0).toBeGreaterThan(0);
  });

  test("serves the global English feed as valid RSS", async ({ request }) => {
    const response = await request.get("/en/feed.xml");

    expect(response.status()).toBe(HTTP_OK);
    expect(response.headers()["content-type"]).toContain(XML_CONTENT_TYPE);

    const body = await response.text();

    expect(body).toContain("<rss");
    expect(body).toContain(
      `<title>${escapeXml(en["feed.website.title"])}</title>`
    );
    expect(body).toContain(
      `<atom:link href="${SITE_URL}/en/feed.xml" rel="self"`
    );
    expect(body.match(/<item>/g)?.length ?? 0).toBeGreaterThan(0);
  });

  /* Collection-specific feed titles are built from the section page's own
   * title (content-derived), so this only checks structure, not exact
   * text. */
  test("serves a collection-specific feed (English blog posts) as valid RSS", async ({
    request,
  }) => {
    const response = await request.get("/en/blog/posts/feed.xml");

    expect(response.status()).toBe(HTTP_OK);
    expect(response.headers()["content-type"]).toContain(XML_CONTENT_TYPE);

    const body = await response.text();

    expect(body).toContain("<rss");
    expect(body).toContain(
      `<atom:link href="${SITE_URL}/en/blog/posts/feed.xml" rel="self"`
    );
    expect(body.match(/<item>/g)?.length ?? 0).toBeGreaterThan(0);
  });
});
