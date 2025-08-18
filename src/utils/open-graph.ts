import { isDefaultLanguage } from "../services/i18n";
import { useRouting } from "../services/routing";
import type { MimeTypeImage } from "../types/mime-type";
import { removeTrailingSlashes } from "./strings";
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
 * @returns {Promise<OpenGraphImg>} An object containing the image data.
 */
export const getOpenGraphImg = async ({
  locale,
  slug,
}: GetOpenGraphImgConfig): Promise<OpenGraphImg> => {
  const { routeById } = await useRouting();
  const ogHomeImgPath = isDefaultLanguage(locale) ? "home" : `${locale}/home`;
  const ogImgPath =
    slug === routeById(`${locale}/home`) ? ogHomeImgPath : slug.slice(1);

  return {
    height: 630,
    type: "image/png",
    url: new URL(`/og/${removeTrailingSlashes(ogImgPath)}.png`, getWebsiteUrl())
      .href,
    width: 1200,
  };
};
