import { authors } from "./lib/astro/collections/schema/authors";
import { blogCategories } from "./lib/astro/collections/schema/blog-categories";
import { blogPosts } from "./lib/astro/collections/schema/blog-posts";
import { blogroll } from "./lib/astro/collections/schema/blogroll";
import { bookmarks } from "./lib/astro/collections/schema/bookmarks";
import { guides } from "./lib/astro/collections/schema/guides";
import { notes } from "./lib/astro/collections/schema/notes";
import { pages } from "./lib/astro/collections/schema/pages";
import { projects } from "./lib/astro/collections/schema/projects";
import { tags } from "./lib/astro/collections/schema/tags";

export const collections = {
  authors,
  "blog.categories": blogCategories,
  "blog.posts": blogPosts,
  blogroll,
  bookmarks,
  guides,
  notes,
  pages,
  projects,
  tags,
};
