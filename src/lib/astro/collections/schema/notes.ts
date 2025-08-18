import { defineCollection, reference, z } from "astro:content";
import { isAvailableLocale } from "../../../../utils/type-guards";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const notes = defineCollection({
  loader: globLoader("notes"),
  schema: contentsBaseSchema
    .extend({
      i18n: z
        .record(z.string().refine(isAvailableLocale), reference("notes"))
        .optional(),
      permaslug: z.string().optional(),
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
