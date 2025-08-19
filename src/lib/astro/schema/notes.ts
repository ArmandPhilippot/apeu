import { defineCollection, reference, z } from "astro:content";
import { globLoader } from "../loaders";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const notes = defineCollection({
  loader: globLoader("notes"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .omit({ cover: true })
      .extend({
        i18n: i18nSchema("notes").optional(),
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
