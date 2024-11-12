import { defineCollection, reference, z } from "astro:content";
import { CONFIG } from "../../../utils/constants";
import { globLoader } from "../loaders/glob-loader";
import { contentsBaseSchema, locale } from "./utils";

export const bookmarks = defineCollection({
  loader: globLoader("bookmarks"),
  schema: contentsBaseSchema
    .omit({ route: true, seo: true, slug: true })
    .extend({
      inLanguage: locale.optional().default(CONFIG.LANGUAGES.DEFAULT),
      tags: z.array(reference("tags")).optional(),
      url: z.string().url(),
    })
    .transform(
      ({
        inLanguage,
        isDraft,
        locale: _locale,
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
