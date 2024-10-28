---
"apeu": minor
---

Adds support for components stories.

To enable this feature, you need to import and add the integration in your configuration file:

```diff
import { defineConfig } from "astro/config";
+import { componentsStories } from "./src/lib/astro/integrations/components-stories";

export default defineConfig({
+  integrations: [
+    componentsStories({
+      components: "./path/to/components/directory",
+    }),
+  ],
});
```

You can now define stories for your components using the `.stories.astro` extension. Your story file should look like any Astro page. The only differences are:

- they can be injected under a parent slug (e.g. `/design-system`),
- their purpose is to show your component variants and to give advices about their use.

You can also divide your stories in multiple files. Here are the supported structures:

```text
/src/components
├── button/
│   ├── stories/
│   │   ├── primary-button.stories.astro
│   │   └── secondary-button.stories.astro
│   ├── button.astro
│   └── button.stories.astro
├── field/
│   ├── stories/
│   │   ├── numeric-field.stories.astro
│   │   ├── text-field.stories.astro
│   │   └── index.stories.astro
│   └── field.astro
└── link/
    ├── link.astro
    └── link.stories.astro
```

Those structures will be available with the following slugs:

- /button
- /button/primary-button
- /button/secondary-button
- /field
- /field/numeric-field
- /field/text-field
- /link

You can use the `baseSlug` option to injects those route under another route. For example, using `baseSlug: '/design-system'`, the previous slugs would be updated to:

- /design-system/button
- /design-system/button/primary-button
- /design-system/button/secondary-button
- /design-system/field
- /design-system/field/numeric-field
- /design-system/field/text-field
- /design-system/link
