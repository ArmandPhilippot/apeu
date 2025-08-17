import type { ImageFunction } from "astro:content";
import { z } from "astro:schema";
import { isAvailableLanguage } from "../../../../services/i18n";
import { CONFIG } from "../../../../utils/constants";
import { applyTimezone } from "../../../../utils/dates";

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

/* eslint-disable jsdoc/require-returns-type -- Don't know how to infer the return type before declaration... So I guess it's safe to omit it here. */
/**
 * Shareable schema to define a cover.
 *
 * @param {ImageFunction} image - The image function provided by Astro.
 * @returns The zod schema.
 */
export const coverSchema = (image: ImageFunction) =>
  z.object({
    src: image(),
    position: objectPosition.optional(),
  });
/* eslint-enable jsdoc/require-returns-type */

const dateSchema = z.coerce
  .date()
  .transform((date) =>
    applyTimezone(date, { lang: "fr-FR", timezone: CONFIG.TIMEZONE })
  );

export const locale = z
  .string()
  .refine(isAvailableLanguage)
  .optional()
  .default(CONFIG.LANGUAGES.DEFAULT);

export const seo = z.object({
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
  description: z.string().max(155),
  nofollow: z.boolean().optional(),
  noindex: z.boolean().optional(),
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
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
});
