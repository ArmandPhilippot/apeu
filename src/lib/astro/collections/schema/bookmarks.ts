import { defineCollection, reference, z } from "astro:content";
import { isValidLanguageCode } from "../../../../utils/locales";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const bookmarks = defineCollection({
  loader: globLoader("bookmarks"),
  schema: contentsBaseSchema
    .omit({ route: true, seo: true, slug: true })
    .extend({
      inLanguage: z.string().refine(isValidLanguageCode),
      tags: z.array(reference("tags")).optional(),
      url: z.string().url(),
    })
    .transform(
      ({
        inLanguage,
        isDraft,
        locale,
        publishedOn,
        tags,
        updatedOn,
        ...bookmark
      }) => {
        return {
          ...bookmark,
          meta: {
            inLanguage,
            isDraft,
            publishedOn,
            tags,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      },
    ),
});
