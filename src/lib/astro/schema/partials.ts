import { z } from "astro/zod";
import {
  reference,
  type CollectionKey,
  type ImageFunction,
} from "astro:content";
import { CONFIG } from "../../../utils/constants";
import { applyTimezone } from "../../../utils/dates";
import { isAvailableLocale } from "../../../utils/type-guards";

/* eslint-disable jsdoc/require-returns-type -- I can't infer the return type of the exported functions before declaration and creating a type only to satisfy the JSDoc plugin seems wrong to me. */

const coverPositionSchema = z.enum([
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

/**
 * Shareable schema to define a cover.
 *
 * @param {ImageFunction} image - The image function provided by Astro.
 * @returns The zod schema.
 */
const coverSchema = (image: ImageFunction) =>
  z.object({
    src: image(),
    position: coverPositionSchema.optional(),
  });

const dateSchema = z.coerce
  .date()
  .transform((date) =>
    applyTimezone(date, { lang: "fr-FR", timezone: CONFIG.TIMEZONE })
  );

/**
 * Shareable schema to define the i18n property.
 *
 * @param {CollectionKey} collection - The referenced collection.
 * @returns The zod schema.
 */
export const i18nSchema = (collection: CollectionKey) =>
  z.record(z.string().refine(isAvailableLocale), reference(collection));

const localeSchema = z
  .string()
  .refine(isAvailableLocale)
  .optional()
  .default(CONFIG.LANGUAGES.DEFAULT);

const seoSchema = z.object({
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
  description: z.string().max(155),
  nofollow: z.boolean().optional(),
  noindex: z.boolean().optional(),
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Self-explanatory. */
  title: z.string().min(2).max(70),
});

/**
 * Shareable schema to content collections common properties.
 *
 * @param {ImageFunction} image - The image function provided by Astro.
 * @returns The zod schema.
 */
export const contentsBaseSchema = (image: ImageFunction) =>
  z.object({
    cover: coverSchema(image).optional(),
    description: z.string(),
    isDraft: z.boolean().optional().default(false),
    locale: localeSchema,
    permaslug: z.string().optional(),
    publishedOn: dateSchema,
    seo: seoSchema,
    title: z.string(),
    updatedOn: dateSchema.optional(),
  });
/* eslint-enable jsdoc/require-returns-type */
