---
"apeu": patch
---

Fixes broken navigation under the `astro-stories` base route when the project sets `trailingSlash: "always"`.

The integration now reads the `trailingSlash` option from the Astro config and normalizes every computed route accordingly, so it works with `"always"`, `"never"` and `"ignore"` without enforcing a single convention.
