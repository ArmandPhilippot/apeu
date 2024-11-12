---
"apeu": minor
---

Defines content collections schemas.

The following collections are now available: `authors`, `blogroll`, `bookmarks`, `blogCategories`, `blogPosts`, `guides`, `notes`, `projects` and `tags`. To define contents for these collections, your content directory should use the following structure:

```
content/
├── authors/
│   └── john-doe.json
├── blogroll/
│   ├── index.md
│   └── blog1.json
├── bookmarks/
│   ├── index.md
│   └── bookmark1.json
└── en/
    ├── blog/
    │   ├── categories/
    │   │   ├── index.md
    │   │   └── category1.md
    │   ├── posts/
    │   │   ├── index.md
    │   │   └── post1.md
    │   └── posts/
    ├── guides/
    │   ├── index.md
    │   └── guide1.md
    ├── notes/
    │   ├── index.md
    │   └── note1.md
    ├── pages/
    │   ├── home.md
    │   └── search.md
    ├── projects/
    │   ├── index.md
    │   └── project1.md
    └── tags/
        ├── index.md
        └── tag1.md
```

There are two types of pages available:

- the pages co-located with your collection (to provide meta and optional content for the index page) named `index.md`
- the ones located in the `pages` directory and that can use any filename
