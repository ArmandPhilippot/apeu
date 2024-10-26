---
"apeu": minor
---

Adds support for dev-only pages.

To use this feature, you need to add a new integration in your configuration file:

```diff
import { defineConfig } from "astro/config";
+import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";

export default defineConfig({
+  integrations: [
+    devOnlyPages({
+      prefix: "_dev_",
+    }),
+  ],
});
```

You can now create pages without adding them to the final build by using the `_dev_` prefix. To access those pages in your browser, just use the filename without the prefix (e.g. `/src/pages/_dev_design-system` can be accessed using `/design-system` as slug).
