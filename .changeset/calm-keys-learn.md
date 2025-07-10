---
"apeu": minor
---

Split the pages collection.

Previously, the `pages` collection contained both regular pages and index pages. Now, the collection is divided into two: `pages` and `index.pages`. This allows to identify which pages match an `index.md` page easily. If you were using the previous behavior to fetch all the pages at once, you'll need to update your query:

```diff
-await queryCollection("pages");
+await queryCollection(["index.pages", "pages"]);
```

And if you were requesting a single page while targeting an index page, you'll need to update the collection name:

```diff
-await queryEntry("pages", "directory-name");
+await queryEntry("index.pages", "directory-name");
```
