---
"apeu": minor
---

Adds support for setting card sizes at content level.

Previously, the minimal card size used on index pages could have two fixed value: either `30em` or `22em`. Now, the size can be defined per content in the frontmatter of index pages using `minCardSize` and the default value is always `30em`.

If some of your content relied on the previous behavior, you can set `minCardSize` to `22em` in the frontmatter to keep the same card size as before.

```diff
---
title: Tags
description: "This is an excerpt of tags index page."
publishedOn: "2024-11-11T17:40"
+minCardSize: "22em"
---
```
