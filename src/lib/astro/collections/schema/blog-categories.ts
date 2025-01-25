import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const blogCategories = defineCollection({
  loader: globLoader("blog.categories"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        cover: image().optional(),
        i18n: z
          .record(
            z.string().refine(isAvailableLanguage),
            reference("blogCategories"),
          )
          .optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...category }) => {
        return {
          ...category,
          // `<Image />` component expect the src to be the full object.
          ...(category.cover ? { cover: { src: category.cover } } : {}),
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});
