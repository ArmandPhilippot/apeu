import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { isValidLanguageCode } from "../../../../utils/locales";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const blogroll = defineCollection({
  loader: globLoader("blogroll"),
  schema: contentsBaseSchema
    .omit({ description: true, route: true, seo: true, slug: true })
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
