import { defineCollection } from "astro:content";
import { globLoader } from "../loaders";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const blogCategories = defineCollection({
  loader: globLoader("blog.categories"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .extend({
        i18n: i18nSchema("blog.categories").optional(),
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
