---
"apeu": minor
---

Switches `build.format` config from `preserve` to `directory`.

Using `trailingSlash: "always"` in `astro.config.mjs` is not compatible with `build.format: "preserve"` and will cause a build error in some cases.

If you were relying on the build output being, for example, `/dist/client/en/404.html` to localize the 404 page, you will need to update your code to use `/dist/client/en/404/index.html` instead.
