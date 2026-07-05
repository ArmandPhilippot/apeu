import { resolveSrc } from "astro/assets/utils";
import type { Img } from "../types/data";

/**
 * Retrieve an image source from a path or an imported image.
 *
 * @param {Pick<Img, "src">} img - The image.
 * @returns {Promise<string>} The resolved image src.
 */
export const getImgSrc = async (img: Pick<Img, "src">): Promise<string> => {
  const src = await resolveSrc(img.src);
  return typeof src === "string" ? src : src.src;
};
