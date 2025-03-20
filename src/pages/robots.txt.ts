import type { APIContext, APIRoute } from "astro";

/**
 * Generates the content of a `robots.txt` file.
 *
 * @param {URL} sitemapURL - The URL of the sitemap index.
 * @returns {string} The contents of the `robots.txt` file.
 */
const getRobotsTxt = (sitemapURL: URL): string => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

/**
 * Handles the `GET` request to generate the `robots.txt` file at build time.
 *
 * @param {APIContext} context - The Astro API context.
 * @returns {Response} The response containing the `robots.txt` file content.
 */
export const GET: APIRoute = ({ site }: APIContext): Response => {
  const sitemapURL = new URL("./sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
