import type { APIRoute } from "astro";
import { resolve } from "node:path";
import sharp from "sharp";
import ico from "sharp-ico";

/*
 * With a relative path, Astro will try to resolve the path from `/dist/server`
 * once built, so we need an "absolute" path here.
 */
const favicon = resolve("src/assets/favicon.png");

export const GET: APIRoute = async () => {
  const buffer = await sharp(favicon).resize(32).toFormat("png").toBuffer();
  const icoBuffer = ico.encode([buffer]);

  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
};
