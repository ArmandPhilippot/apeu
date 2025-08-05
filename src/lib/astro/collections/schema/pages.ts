import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema, coverSchema } from "./partials";

export const pages = defineCollection({
  loader: globLoader("pages"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: coverSchema(image).optional(),
        i18n: z
          .record(z.string().refine(isAvailableLanguage), reference("pages"))
          .optional(),
        permaslug: z.string().optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...page }) => {
        return {
          ...page,
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});
