import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import {
  isValidCountryCode,
  isValidLanguageCode,
} from "../../../utils/locales";

export const authors = defineCollection({
  loader: glob({
    pattern: "*.json",
    base: `./content/authors`,
  }),
  schema: ({ image }) =>
    z
      .object({
        avatar: image().optional(),
        email: z.string().email().optional(),
        firstName: z.string(),
        firstNameIPA: z.string().optional(),
        lastName: z.string(),
        lastNameIPA: z.string().optional(),
        website: z.string().url().optional(),
        isWebsiteOwner: z.boolean().optional().default(false),
        job: z.string().optional(),
        country: z
          .string()
          .length(2)
          .toUpperCase()
          .refine(isValidCountryCode)
          .optional(),
        nationality: z
          .string()
          .length(2)
          .toUpperCase()
          .refine(isValidCountryCode)
          .optional(),
        spokenLanguages: z
          .array(z.string().refine(isValidLanguageCode))
          .optional(),
        socialMedia: z
          .object({
            diaspora: z.string().url().optional(),
            facebook: z.string().url().optional(),
            github: z.string().url().optional(),
            gitlab: z.string().url().optional(),
            linkedin: z.string().url().optional(),
            mastodon: z.string().url().optional(),
            reddit: z.string().url().optional(),
            stackoverflow: z.string().url().optional(),
            x: z.string().url().optional(),
          })
          .optional(),
      })
      .transform((author) => {
        return {
          ...author,
          // `<Image />` component expect the src to be the full object.
          ...(author.avatar ? { avatar: { src: author.avatar } } : {}),
          name: `${author.firstName} ${author.lastName}`,
          ...(author.firstNameIPA && author.lastNameIPA
            ? { nameIPA: `${author.firstNameIPA} ${author.lastNameIPA}` }
            : {}),
        };
      }),
});
