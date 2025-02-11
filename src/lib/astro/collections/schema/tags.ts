import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema, coverSchema } from "./partials";

export const tags = defineCollection({
  loader: globLoader("tags"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: coverSchema(image).optional(),
        i18n: z
          .record(z.string().refine(isAvailableLanguage), reference("tags"))
          .optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...tag }) => {
        return {
          ...tag,
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});
