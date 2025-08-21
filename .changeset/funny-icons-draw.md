---
"apeu": major
---

Replaces the `route` helper from `useI18n` with `useRouting`.

Routes are no longer handled statically in a translation file but dynamically in an index built from data provided in your content directory. Because of that, the `route` property has been removed from the object returned by `useI18n()`.

If you need to display a route in your templates, you'll need to import and use the `useRouting()` utility instead. This returns an object containing a `routeById()` helper.

```diff
---
import { useI18n } from "../../../services/i18n";
+import { useRouting } from "../../../services/routing";

-const { locale, route, translate } = useI18n(Astro.currentLocale);
+const { locale, translate } = useI18n(Astro.currentLocale);
+const { routeById } = await useRouting();

const mainNav = [
  {
    icon: "home",
    iconSize: 28,
    label: translate("page.home.title"),
-    url: route("home"),
+    url: routeById(`${locale}/home`),
  },
  {
    icon: "blog",
    iconSize: 28,
    label: translate("page.blog.title"),
-    url: route("blog"),
+    url: routeById(`${locale}/blog`),
  },
];
---
```
