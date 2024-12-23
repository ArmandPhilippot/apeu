---
"apeu": minor
---

Adds support to redirect to a translated page using the language picker.

Previously, when using the language picker, the user was redirected to the homepage of the selected locale. Now, it is possible to redirect to the matching translated page.

For example, if an user lands on `/en/blog/posts`, he can switch to `/fr/blog/articles` instead! If a translated route is not provided, the user will be redirected to the homepage of the selected locale.
