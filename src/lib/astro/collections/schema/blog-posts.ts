import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../services/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema, coverSchema } from "./partials";

export const blogPosts = defineCollection({
  loader: globLoader("blog.posts"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        authors: z.array(reference("authors")),
        category: reference("blog.categories"),
        cover: coverSchema(image).optional(),
        i18n: z
          .record(
            z.string().refine(isAvailableLanguage),
            reference("blog.posts")
          )
          .optional(),
        permaslug: z.string().optional(),
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
        }
      ),
});
