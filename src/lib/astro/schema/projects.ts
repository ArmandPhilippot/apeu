import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import { globLoader } from "../loaders";
import { contentsBaseSchema, i18nSchema } from "./partials";

export const projects = defineCollection({
  loader: globLoader("projects"),
  schema: ({ image }) =>
    contentsBaseSchema(image)
      .extend({
        i18n: i18nSchema("projects").optional(),
        isArchived: z.boolean().optional().default(false),
        kind: z.union([
          z.literal("app"),
          z.literal("site"),
          z.literal("theme"),
        ]),
        repository: z
          .object({
            name: z.string(),
            url: z.url(),
          })
          .optional(),
        tags: z.array(reference("tags")).optional(),
      })
      .transform(
        ({
          isArchived,
          isDraft,
          kind,
          publishedOn,
          repository,
          tags,
          updatedOn,
          ...project
        }) => {
          return {
            ...project,
            meta: {
              isArchived,
              isDraft,
              kind,
              publishedOn,
              repository,
              tags,
              updatedOn: updatedOn ?? publishedOn,
            },
          };
        }
      ),
});
