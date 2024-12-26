---
"apeu": patch
---

Adds support for filtering blogroll by locale.

Currently, when a blog have a description only in one locale, it is displayed in the blogroll for all locales. The `locale` filter is never applied for the blogs.

With this fix, we can now filter the blogs by locale with `queryCollection`. If a blog does not have a description in the current locale, it will not be returned.
