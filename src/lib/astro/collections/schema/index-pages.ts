import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema, coverSchema } from "./partials";

export const indexPages = defineCollection({
  loader: globLoader("index.pages"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: coverSchema(image).optional(),
        i18n: z
          .record(
            z.string().refine(isAvailableLanguage),
            reference("index.pages")
          )
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
