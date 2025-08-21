---
"apeu": major
---

Divides the pages collection in two: `pages` and `index.pages`.

The `pages` collection contained both regular pages and index pages. This was making `index.md` page identification harder. To work around that issue, the collection has been divided in two: `pages` and `index.pages`.

If you were using the previous behavior to fetch all the pages at once, you'll need to update your queries:

```diff
-await queryCollection("pages");
+await queryCollection(["index.pages", "pages"]);
```

If you were requesting a single page while targeting an index page, you'll need to update the collection name:

```diff
-await queryEntry("pages", "directory-name");
+await queryEntry("index.pages", "directory-name");
```
