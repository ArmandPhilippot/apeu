import { resolve } from "node:path";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { encode } from "sharp-ico";

/*
 * With a relative path, Astro will try to resolve the path from `/dist/server`
 * once built, so we need an "absolute" path here.
 */
const favicon = resolve("src/assets/favicon.png");

/**
 * Handles the `GET` request to generate the `favicon.ico` file at build time.
 *
 * @returns {Promise<Response>} The response containing the `favicon.ico` file content.
 */
export const GET: APIRoute = async (): Promise<Response> => {
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
  const buffer = await sharp(favicon).resize(32).toFormat("png").toBuffer();
  const icoBuffer = encode([buffer]);

  return new Response(Buffer.from(icoBuffer), {
    headers: { "Content-Type": "image/x-icon" },
  });
};
