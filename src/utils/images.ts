import type { Img } from "../types/data";
import { isString } from "./type-checks";

/**
 * Retrieve an image source from a path or an imported image.
 *
 * @param {Pick<Img, "src">} img - The image.
 * @returns {Promise<string>} The src.
 */
export const getImgSrc = async (img: Pick<Img, "src">): Promise<string> => {
  if (isString(img.src)) return img.src;
  const resolvedImg = await img.src;
  if ("default" in resolvedImg) return resolvedImg.default.src;
  return resolvedImg.src;
};
