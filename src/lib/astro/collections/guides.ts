import { defineCollection, reference, z } from "astro:content";
import { globLoader } from "../loaders/glob-loader";
import { contentsBaseSchema } from "./utils";

export const guides = defineCollection({
  loader: globLoader("guides"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        authors: z.array(reference("authors")),
        cover: z
          .object({
            alt: z.string(),
            src: image(),
          })
          .optional(),
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
        },
      ),
});
