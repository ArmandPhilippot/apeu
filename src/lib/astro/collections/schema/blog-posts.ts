import { defineCollection, reference, z } from "astro:content";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

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
        tags: z.array(reference("tags")).optional(),
      })
      .transform(
        ({
          authors,
          category,
          isDraft,
          publishedOn,
          tags,
          updatedOn,
          ...post
        }) => {
          return {
            ...post,
            meta: {
              authors,
              category,
              isDraft,
              publishedOn,
              tags,
              updatedOn: updatedOn ?? publishedOn,
            },
          };
        },
      ),
});
