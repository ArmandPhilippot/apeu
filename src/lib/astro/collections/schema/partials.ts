import type { ImageFunction } from "astro:content";
import { z } from "astro:schema";
import { CONFIG } from "../../../../utils/constants";
import { applyTimezone } from "../../../../utils/dates";
import { isAvailableLanguage } from "../../../../utils/i18n";

const objectPosition = z.enum([
  "top",
  "top center",
  "center top",
  "bottom",
  "bottom center",
  "center bottom",
  "left",
  "left center",
  "center left",
  "right",
  "right center",
  "center right",
  "center",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
]);

export const coverSchema = (image: ImageFunction) =>
  z.object({
    src: image(),
    position: objectPosition.optional(),
  });

const dateSchema = z.coerce.date().transform((date) => {
  return applyTimezone(date, { lang: "fr-FR", timezone: CONFIG.TIMEZONE });
});

export const locale = z
  .string()
  .refine(isAvailableLanguage)
  .optional()
  .default(CONFIG.LANGUAGES.DEFAULT);

export const seo = z.object({
  description: z.string().max(155),
  nofollow: z.boolean().optional(),
  noindex: z.boolean().optional(),
  title: z.string().min(2).max(70),
});

export const contentsBaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  isDraft: z.boolean().optional().default(false),
  publishedOn: dateSchema,
  updatedOn: dateSchema.optional(),
  seo,
  locale,
  slug: z.string().default(""),
  route: z.string().default(""),
});
