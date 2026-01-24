import type { CollectionEntry } from "astro:content";

export const authorFixture = {
  collection: "authors",
  data: {
    isWebsiteOwner: false,
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
  },
  id: "john-doe",
} as const satisfies CollectionEntry<"authors">;

export const blogCategoryFixture = {
  collection: "blog.categories",
  data: {
    description: "The category description.",
    locale: "en",
    meta: {
      isDraft: false,
      publishedOn: new Date("2024-09-22T20:54:19.968Z"),
      updatedOn: new Date("2024-09-22T20:54:19.968Z"),
    },
    seo: {
      description: "The category description for search engines.",
      title: "The category title for search engines",
    },
    title: "The category title",
  },
  id: "en/micro-blog",
} as const satisfies CollectionEntry<"blog.categories">;

export const blogPostFixture = {
  collection: "blog.posts",
  data: {
    description: "The blog post description.",
    locale: "en",
    meta: {
      authors: [{ collection: "authors", id: "john-doe" }],
      category: {
        collection: "blog.categories",
        id: "micro-blog",
      },
      isDraft: false,
      publishedOn: new Date("2024-09-22T21:10:11.400Z"),
      updatedOn: new Date("2024-09-22T21:10:11.400Z"),
      tags: undefined,
    },
    seo: {
      description: "The blog post description for search engines.",
      title: "The blog post title for search engines",
    },
    title: "The blog post title",
  },
  id: "en/my-awesome-post",
} as const satisfies CollectionEntry<"blog.posts">;

export const blogrollFixture = {
  collection: "blogroll",
  data: {
    description: {
      en: "The blog description in English.",
    },
    meta: {
      inLanguages: ["en"],
      isDraft: false,
      publishedOn: new Date("2024-09-22T21:00:40.723Z"),
      tags: [],
      updatedOn: new Date("2024-09-22T21:00:40.723Z"),
    },
    title: "The blog title",
    url: "https://great-blog.test",
  },
  id: "great-blog",
} as const satisfies CollectionEntry<"blogroll">;

export const bookmarkFixture = {
  collection: "bookmarks",
  data: {
    description: "The bookmark description.",
    isQuote: false,
    meta: {
      inLanguage: "en",
      isDraft: false,
      publishedOn: new Date("2024-09-22T21:00:40.797Z"),
      tags: [],
    },
    title: "The bookmark title",
    url: "https://any-site.test/must-read",
  },
  id: "must-read-bookmark",
} as const satisfies CollectionEntry<"bookmarks">;

export const guideFixture = {
  collection: "guides",
  data: {
    description: "The guide description.",
    locale: "en",
    meta: {
      authors: [{ collection: "authors", id: "john-doe" }],
      isDraft: false,
      publishedOn: new Date("2024-09-22T21:00:40.799Z"),
      tags: undefined,
      updatedOn: new Date("2024-09-22T21:00:40.799Z"),
    },
    seo: {
      description: "The guide description for search engines.",
      title: "The guide title for search engines",
    },
    title: "officia qui a",
  },
  id: "en/in-depth-guide",
} as const satisfies CollectionEntry<"guides">;

export const noteFixture = {
  collection: "notes",
  data: {
    description: "The note description.",
    locale: "en",
    meta: {
      isDraft: false,
      publishedOn: new Date("2024-09-22T21:00:40.802Z"),
      tags: undefined,
      updatedOn: new Date("2024-09-22T21:00:40.802Z"),
    },
    seo: {
      description: "The note description for search engines.",
      title: "The note title for search engines",
    },
    title: "The note title",
  },
  id: "temporary-note",
} as const satisfies CollectionEntry<"notes">;

export const tagFixture = {
  collection: "tags",
  data: {
    description: "The tag description.",
    locale: "en",
    meta: {
      isDraft: false,
      publishedOn: new Date("2024-09-22T20:54:19.968Z"),
      updatedOn: new Date("2024-09-22T20:54:19.968Z"),
    },
    seo: {
      description: "The tag description for search engines.",
      title: "The tag title for search engines",
    },
    title: "The tag title",
  },
  id: "catchall-tag",
} as const satisfies CollectionEntry<"tags">;
