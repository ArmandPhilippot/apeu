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
    route: "/blog/category/micro-blog",
    seo: {
      description: "The category description for search engines.",
      title: "The category title for search engines",
    },
    slug: "micro-blog",
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
    route: "/blog/post/my-awesome-post",
    seo: {
      description: "The blog post description for search engines.",
      title: "The blog post title for search engines",
    },
    slug: "my-awesome-post",
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
    route: "/guides/in-depth-guide",
    seo: {
      description: "The guide description for search engines.",
      title: "The guide title for search engines",
    },
    slug: "in-depth-guide",
    title: "officia qui a",
  },
  id: "en/in-depth-guide",
} as const satisfies CollectionEntry<"guides">;

export const indexPageFixture = {
  collection: "index.pages",
  data: {
    description: "The page description.",
    locale: "en",
    meta: {
      isDraft: false,
      publishedOn: new Date("2024-09-22T20:54:19.962Z"),
      updatedOn: new Date("2024-09-22T20:54:19.962Z"),
    },
    route: "/generic-page",
    seo: {
      description: "The page description for search engines.",
      title: "The page title for search engines",
    },
    slug: "generic-page",
    title: "The page title",
  },
  id: "en/generic-page",
} as const satisfies CollectionEntry<"index.pages">;

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
    route: "/notes/temporary-note",
    seo: {
      description: "The note description for search engines.",
      title: "The note title for search engines",
    },
    slug: "temporary-note",
    title: "The note title",
  },
  id: "temporary-note",
} as const satisfies CollectionEntry<"notes">;

export const pageFixture = {
  collection: "pages",
  data: {
    description: "The page description.",
    locale: "en",
    meta: {
      isDraft: false,
      publishedOn: new Date("2024-09-22T20:54:19.962Z"),
      updatedOn: new Date("2024-09-22T20:54:19.962Z"),
    },
    route: "/generic-page",
    seo: {
      description: "The page description for search engines.",
      title: "The page title for search engines",
    },
    slug: "generic-page",
    title: "The page title",
  },
  id: "en/generic-page",
} as const satisfies CollectionEntry<"pages">;

export const projectFixture = {
  collection: "projects",
  data: {
    description: "The project description.",
    locale: "en",
    meta: {
      isArchived: false,
      isDraft: false,
      kind: "app",
      publishedOn: new Date("2024-09-22T21:00:40.804Z"),
      repository: undefined,
      tags: undefined,
      updatedOn: new Date("2024-09-22T21:00:40.804Z"),
    },
    route: "/projects/revolutionary-project",
    seo: {
      description: "The project description for search engines.",
      title: "The project title for search engines",
    },
    slug: "revolutionary-project",
    title: "The project title",
  },
  id: "revolutionary-project",
} as const satisfies CollectionEntry<"projects">;

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
    route: "/tags/catchall-tag",
    seo: {
      description: "The tag description for search engines.",
      title: "The tag title for search engines",
    },
    slug: "catchall-tag",
    title: "The tag title",
  },
  id: "catchall-tag",
} as const satisfies CollectionEntry<"tags">;
