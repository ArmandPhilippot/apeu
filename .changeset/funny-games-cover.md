---
"apeu": major
---

Moves some helpers from `utils` to `services` and renames some of them.

Some helpers were defined in `src/utils` and have been moved to `src/services` to make the distinction between generic and feature-specific helpers clearer. This will also make splitting the files easier if needed in the future when a feature grows.

If you had templates relying on those helpers, you need to update your code.

For example, feeds and i18n helpers were previously located respectively in `src/utils/feeds` and `src/utils/i18n.ts`. They have been moved to `src/services/feeds` and `src/services/i18n`:
```diff
---
-import { getFeedLanguageFromLocale, getRSSItemsFromEntries } from "../utils/feeds";
-import { isAvailableLanguage, useI18n, type AvailableLanguage } from "../utils/i18n";
-import { getWebsiteUrl } from "../utils/url";
+import { getFeedLanguageFromLocale, getRSSItemsFromEntries } from "../services/feeds";
+import { useI18n } from "../services/i18n";
+import type { AvailableLocale } from "../types/tokens";
+import { WEBSITE_URL } from "../utils/constants";
+import { isAvailableLocale } from "../utils/type-guards";
---
```
