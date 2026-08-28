import { defineCollection } from "astro:content";
import { globLoader } from "../loaders";
import { generatePageId } from "./generate-id";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const pages = defineCollection({
  loader: globLoader("pages", { generateId: generatePageId }),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .extend({
        i18n: i18nSchema("pages").optional(),
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
