---
"apeu": minor
---

Adds `queryCollection` and `queryEntry` helpers to reduce boilerplate code when querying collections entries.

Instead of using directly the `getCollection` helper from Astro, you should use the `queryCollection` helper declared in this project. This function helps you query a collection with filters, offset and ordering. `queryCollection` will also resolves every references!

You can also use it if you need to resolve multiple collections at once or you can use `queryEntry` to resolve a single entry.

You can now reduce the amount of code in your templates:

```astro
---
import { queryCollection } from "src/lib/astro/collections/query-collection";
const { entries, total } = await queryCollection("blogPosts", {
  first: 10,
  orderBy: { key: "publishedOn", order: "DESC" },
});
---

// Your template here
```

Instead of:

```astro
---
import { getCollection, getEntries, getEntry } from "astro:content";
const rawBlogPosts = await getCollection("blogPosts");
const blogPosts = await Promise.all(
  rawBlogPosts.map(async (blogPost) => {
    const category = blogPost.data.category
      ? await getEntry(blogPost.data.category)
      : null;
    const tags = blogPost.data.tags
      ? await getEntries(blogPost.data.tags)
      : null;
    return {
      ...blogPost,
      data: {
        ...blogPost.data,
        category,
        tags,
      },
    };
  }),
);
const orderedBlogPosts = blogPosts.sort(/* some method to sort posts */);
const firstTenBlogPosts = orderedBlogPosts.slice(0, 10);
---

// Your template here
```
