import { defineCollection, reference, z } from "astro:content";
import { isValidLanguageCode } from "../../../../utils/type-guards";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const bookmarks = defineCollection({
  loader: globLoader("bookmarks"),
  schema: contentsBaseSchema
    .omit({ seo: true, updatedOn: true })
    .extend({
      inLanguage: z.string().refine(isValidLanguageCode),
      /**
       * Is the description a quote from the linked post?
       */
      isQuote: z.boolean().optional().default(false),
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
        ...bookmark
      }) => {
        return {
          ...bookmark,
          meta: {
            inLanguage,
            isDraft,
            publishedOn,
            tags,
          },
        };
      }
    ),
});
