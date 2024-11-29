import { defineCollection, z } from "astro:content";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const tags = defineCollection({
  loader: globLoader("tags"),
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
