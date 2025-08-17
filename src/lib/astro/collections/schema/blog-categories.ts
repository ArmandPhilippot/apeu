import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../services/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema, coverSchema } from "./partials";

export const blogCategories = defineCollection({
  loader: globLoader("blog.categories"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: coverSchema(image).optional(),
        i18n: z
          .record(
            z.string().refine(isAvailableLanguage),
            reference("blog.categories")
          )
          .optional(),
        permaslug: z.string().optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...category }) => {
        return {
          ...category,
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});
