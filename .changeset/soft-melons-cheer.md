---
"apeu": patch
---

Fixes the `Invalid content reference` warnings logged during builds for the `authors` and `pages` collections.

If you use the recommended `queryCollection()`, you don't have to change anything in your code.

If you use `getCollection()` and your references start with `authors/` or `pages/`, you need to drop the prefix to match the entry ids.
