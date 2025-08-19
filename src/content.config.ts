import {
  authors,
  blogCategories,
  blogPosts,
  blogroll,
  bookmarks,
  guides,
  indexPages,
  notes,
  pages,
  projects,
  tags,
} from "./lib/astro/schema";

export const collections = {
  authors,
  "blog.categories": blogCategories,
  "blog.posts": blogPosts,
  blogroll,
  bookmarks,
  guides,
  "index.pages": indexPages,
  notes,
  pages,
  projects,
  tags,
};
