import { defineCollection, reference, z } from "astro:content";
import { isAvailableLanguage } from "../../../../utils/i18n";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema } from "./partials";

export const projects = defineCollection({
  loader: globLoader("projects"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        isArchived: z.boolean().optional().default(false),
        cover: z
          .object({
            alt: z.string(),
            src: image(),
          })
          .optional(),
        i18n: z
          .record(z.string().refine(isAvailableLanguage), reference("projects"))
          .optional(),
        kind: z.union([
          z.literal("app"),
          z.literal("site"),
          z.literal("theme"),
        ]),
        repository: z
          .object({
            name: z.string(),
            url: z.string().url(),
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
        },
      ),
});
