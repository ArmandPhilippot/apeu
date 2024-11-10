import { defineCollection, reference, z } from "astro:content";
import { globLoader } from "../loaders/glob-loader";
import { contentsBaseSchema } from "./utils";

export const blogPosts = defineCollection({
  loader: globLoader("blog.posts"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        authors: z.array(reference("authors")),
        category: reference("blogCategories"),
        cover: z
          .object({
            alt: z.string(),
            src: image(),
          })
          .optional(),
      })
      .transform(
        ({ authors, category, isDraft, publishedOn, updatedOn, ...post }) => {
          return {
            ...post,
            meta: {
              authors,
              category,
              isDraft,
              publishedOn,
              updatedOn: updatedOn ?? publishedOn,
            },
          };
        },
      ),
});
