import { defineCollection, reference, z } from "astro:content";
import {
  isAvailableLocale,
  isValidLanguageCode,
} from "../../../utils/type-guards";
import { globLoader } from "../loaders";
import { contentsBaseSchema } from "./partials";

export const blogroll = defineCollection({
  loader: globLoader("blogroll"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .omit({
        cover: true,
        description: true,
        locale: true,
        permaslug: true,
        seo: true,
      })
      .extend({
        description: z.record(z.string().refine(isAvailableLocale), z.string()),
        feed: z.string().url().optional(),
        inLanguages: z.array(z.string().refine(isValidLanguageCode)),
        tags: z.array(reference("tags")).optional(),
        url: z.string().url(),
      })
      .transform(
        ({ inLanguages, isDraft, publishedOn, tags, updatedOn, ...blog }) => {
          return {
            ...blog,
            meta: {
              inLanguages,
              isDraft,
              publishedOn,
              tags,
              updatedOn: updatedOn ?? publishedOn,
            },
          };
        }
      ),
});
