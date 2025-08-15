---
"apeu": major
---

<!-- cSpell:ignore extrait s'agit utilisée moteurs -->

Adds a `permaslug` frontmatter property to localize the routes.

This project no longer localize routes in French for you. A `permaslug` property has been introduced to let you define the translation by yourself in the frontmatter of your content files.

If you were relying on automatic translation for your routes, you'll need to update your files. For example, given a route `/en/blog/posts/post-1` previously localized in French as `/blog/articles/post-1`, you will need to update your `content/fr/blog/posts/index.mdx` file to include a `permaslug`:

```diff
---
title: Articles
description: "C'est un extrait de la page d'index des articles du blog."
publishedOn: "2024-12-19T14:51"
seo:
  title: "Articles"
  description: "Il s'agit d'une description utilisée par les moteurs de recherche."
i18n:
  en: "en/blog/posts"
+permaslug: "articles"
---
```

Then, if you want to also localize `post-1`, you can either translate the filename or use a `permaslug` in your `content/fr/blog/posts/post-1.mdx` file (e.g. `permaslug: article-1`).
