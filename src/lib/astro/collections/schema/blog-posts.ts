import { defineCollection, reference, z } from "astro:content";
import { isAvailableLocale } from "../../../../utils/type-guards";
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
          .record(z.string().refine(isAvailableLocale), reference("blog.posts"))
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
