import { defineCollection } from "astro:content";
import { globLoader } from "../loaders";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const indexPages = defineCollection({
  loader: globLoader("index.pages"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .extend({
        i18n: i18nSchema("index.pages").optional(),
      })
      .transform(({ isDraft, publishedOn, updatedOn, ...page }) => {
        return {
          ...page,
          meta: {
            isDraft,
            publishedOn,
            updatedOn: updatedOn ?? publishedOn,
          },
        };
      }),
});
