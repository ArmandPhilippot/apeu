import type { APIRoute, ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import type { WebAppManifest } from "web-app-manifest";
import favicon from "../assets/favicon.png";
import { CONFIG } from "../utils/constants";

const getManifestIcons = async (img: ImageMetadata) => {
  const faviconPngSizes = [192, 512] as const; // eslint-disable-line @typescript-eslint/no-magic-numbers -- Self-explanatory.

  return Promise.all(
    faviconPngSizes.map(async (size) => {
      const icon = await getImage({
        src: img,
        width: size,
        height: size,
        format: "png",
      });

      return {
        src: icon.src,
        type: `image/${icon.options.format}`,
        sizes: `${icon.options.width}x${icon.options.height}`,
      };
    })
  );
};

/**
 * Handles the `GET` request to generate the `manifest.json` file at build time.
 *
 * @returns {Promise<Response>} The response containing the `manifest.json` file content.
 */
export const GET: APIRoute = async (): Promise<Response> => {
  const icons = await getManifestIcons(favicon);
  const initials = CONFIG.BRAND.split(" ")
    .map((part) => part[0])
    .join("");

  /* eslint-disable camelcase -- The expected format use snake case so... */
  const manifest: WebAppManifest = {
    lang: CONFIG.LANGUAGES.DEFAULT,
    dir: "ltr",
    name: CONFIG.BRAND,
    short_name: initials,
    description: CONFIG.DESCRIPTION,
    start_url: ".",
    background_color: "#f9fafb",
    theme_color: "#214769",
    display: "standalone",
    icons,
  };
  /* eslint-enable camelcase */

  return new Response(JSON.stringify(manifest));
};
