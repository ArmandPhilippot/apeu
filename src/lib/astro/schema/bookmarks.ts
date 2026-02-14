import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import { isValidLanguageCode } from "../../../utils/type-guards";
import { globLoader } from "../loaders";
import { contentsBaseSchema } from "./partials";

export const bookmarks = defineCollection({
  loader: globLoader("bookmarks"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .omit({
        cover: true,
        locale: true,
        permaslug: true,
        seo: true,
        updatedOn: true,
      })
      .extend({
        inLanguage: z.string().refine(isValidLanguageCode),
        /**
         * Is the description a quote from the linked post?
         */
        isQuote: z.boolean().optional().default(false),
        tags: z.array(reference("tags")).optional(),
        url: z.url(),
      })
      .transform(({ inLanguage, isDraft, publishedOn, tags, ...bookmark }) => {
        return {
          ...bookmark,
          meta: {
            inLanguage,
            isDraft,
            publishedOn,
            tags,
          },
        };
      }),
});
