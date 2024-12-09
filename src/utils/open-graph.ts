import type { MimeTypeImage } from "../types/mime-type";
import { isDefaultLanguage, useI18n } from "./i18n";
import { getWebsiteUrl } from "./url";

type GetOpenGraphImgConfig = {
  locale: string;
  slug: string;
};

export const getOpenGraphImg = ({ locale, slug }: GetOpenGraphImgConfig) => {
  const { route } = useI18n(locale);
  const ogHomeImgPath = isDefaultLanguage(locale) ? "home" : `${locale}/home`;
  const ogImgPath = slug === route("home") ? ogHomeImgPath : slug.slice(1);

  return {
    height: 630,
    type: "image/png" satisfies MimeTypeImage,
    url: new URL(`/og/${ogImgPath}.png`, getWebsiteUrl()).href,
    width: 1200,
  } as const;
};
