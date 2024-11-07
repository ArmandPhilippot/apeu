import type { APIRoute, ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import favicon from "../assets/favicon.png";
import { CONFIG } from "../utils/constants";
import type { WebAppManifest } from "web-app-manifest";

const getManifestIcons = async (img: ImageMetadata) => {
  const faviconPngSizes = [192, 512];

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
    }),
  );
};

export const GET: APIRoute = async () => {
  const icons = await getManifestIcons(favicon);
  const initials = CONFIG.BRAND.split(" ")
    .map((part) => part[0])
    .join("");

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

  return new Response(JSON.stringify(manifest));
};
