---
"apeu": minor
---

Renames `blogPosts` and `blogCategories` collections respectively to `blog.posts` and `blog.categories`.

This project already uses a dot separated format for tokens (i18n, icons). Collections names are also tokens and should follow the same pattern. This change will also help simplify some development logic.
