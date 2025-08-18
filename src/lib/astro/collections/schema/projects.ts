import { defineCollection, reference, z } from "astro:content";
import { isAvailableLocale } from "../../../../utils/type-guards";
import { globLoader } from "../../loaders/glob-loader";
import { contentsBaseSchema, coverSchema } from "./partials";

export const projects = defineCollection({
  loader: globLoader("projects"),
  schema: ({ image }) =>
    contentsBaseSchema
      .extend({
        isArchived: z.boolean().optional().default(false),
        cover: coverSchema(image).optional(),
        i18n: z
          .record(z.string().refine(isAvailableLocale), reference("projects"))
          .optional(),
        kind: z.union([
          z.literal("app"),
          z.literal("site"),
          z.literal("theme"),
        ]),
        permaslug: z.string().optional(),
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
        }
      ),
});
