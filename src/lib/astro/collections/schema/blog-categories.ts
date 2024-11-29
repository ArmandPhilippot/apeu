import { defineCollection, z } from "astro:content";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const blogCategories = defineCollection({
  loader: globLoader("blog.categories"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: z
          .object({
            alt: z.string(),
            src: image(),
          })
          .optional(),
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
