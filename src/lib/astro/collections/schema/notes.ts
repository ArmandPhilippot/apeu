import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const notes = defineCollection({
  loader: globLoader("notes"),
  schema: contentsBaseSchema
    .extend({
      i18n: z
        .record(z.string().refine(isAvailableLanguage), reference("notes"))
        .optional(),
      tags: z.array(reference("tags")).optional(),
    })
    .transform(({ isDraft, publishedOn, tags, updatedOn, ...note }) => {
      return {
        ...note,
        meta: {
          isDraft,
          publishedOn,
          tags,
          updatedOn: updatedOn ?? publishedOn,
        },
      };
    }),
});
