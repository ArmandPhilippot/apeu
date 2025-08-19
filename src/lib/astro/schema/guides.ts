import { defineCollection, reference, z } from "astro:content";
import { globLoader } from "../loaders";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const guides = defineCollection({
  loader: globLoader("guides"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .extend({
        authors: z.array(reference("authors")),
        i18n: i18nSchema("guides").optional(),
        tags: z.array(reference("tags")).optional(),
      })
      .transform(
        ({ authors, isDraft, publishedOn, tags, updatedOn, ...guide }) => {
          return {
            ...guide,
            meta: {
              authors,
              isDraft,
              publishedOn,
              tags,
              updatedOn: updatedOn ?? publishedOn,
            },
          };
        }
      ),
});
