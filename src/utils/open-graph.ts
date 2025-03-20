import type { MimeTypeImage } from "../types/mime-type";
import { isDefaultLanguage, useI18n } from "./i18n";
import { removeTrailingSlash } from "./strings";
import { getWebsiteUrl } from "./url";

type GetOpenGraphImgConfig = {
  locale: string;
  slug: string;
};

type OpenGraphImg = {
  height: number;
  type: MimeTypeImage;
  url: string;
  width: number;
};

/**
 * Retrieve an object describing the OpenGraph image.
 *
 * @param {GetOpenGraphImgConfig} config - An object with the route information.
 * @returns {OpenGraphImg} An object containing the image data.
 */
export const getOpenGraphImg = ({
  locale,
  slug,
}: GetOpenGraphImgConfig): OpenGraphImg => {
  const { route } = useI18n(locale);
  const ogHomeImgPath = isDefaultLanguage(locale) ? "home" : `${locale}/home`;
  const ogImgPath = slug === route("home") ? ogHomeImgPath : slug.slice(1);

  return {
    height: 630,
    type: "image/png",
    url: new URL(`/og/${removeTrailingSlash(ogImgPath)}.png`, getWebsiteUrl())
      .href,
    width: 1200,
  };
};
