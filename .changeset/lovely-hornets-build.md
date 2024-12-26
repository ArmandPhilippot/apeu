---
"apeu": patch
---

Adds support for filtering tags that does not match the current locale.

The `queryCollection` utility was returning the entries without checking the data inside. For `bookmarks`, the `tags` property can contain tags in different locales. So using `where: {locale: "fr"}`, we now filter the tags to return only the ones matching the given locale.
