import { defineCollection, reference, z } from "astro:content";
import {
  isAvailableLanguage,
  isValidLanguageCode,
} from "../../../../services/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const blogroll = defineCollection({
  loader: globLoader("blogroll"),
  schema: contentsBaseSchema
    .omit({ description: true, seo: true })
    .extend({
      description: z.record(z.string().refine(isAvailableLanguage), z.string()),
      feed: z.string().url().optional(),
      inLanguages: z.array(z.string().refine(isValidLanguageCode)),
      tags: z.array(reference("tags")).optional(),
      url: z.string().url(),
    })
    .transform(
      ({
        inLanguages,
        isDraft,
        locale: _locale,
        publishedOn,
        tags,
        updatedOn,
        ...blog
      }) => {
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
