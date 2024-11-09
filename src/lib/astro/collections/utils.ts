import { z } from "astro:content";
import { CONFIG } from "../../../utils/constants";
import { isAvailableLanguage } from "../../../utils/i18n";

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
  publishedOn: z.coerce.date(),
  updatedOn: z.coerce.date().optional(),
  seo,
  locale,
  slug: z.string().default(""),
  route: z.string().default(""),
});
