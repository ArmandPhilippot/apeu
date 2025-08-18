---
"apeu": major
---

Moves some helpers from `utils` to `services`.

Some helpers were defined in `src/utils` and have been moved to `src/services` to make the distinction between generic and feature-specific helpers clearer.

For example, feeds and i18n helpers were previously located respectively in `src/utils/feeds` and `src/utils/i18n.ts`. They have been moved to `src/services/feeds` and `src/services/i18n`. This seems semantically better and make splitting the files easier.

If you had templates relying on those helpers, you need to update your code:
```diff
---
-import { getFeedLanguageFromLocale, getRSSItemsFromEntries } from "../utils/feeds";
-import { isAvailableLanguage, useI18n, type AvailableLanguage } from "../utils/i18n";
-import { getWebsiteUrl } from "../utils/url";
+import { getFeedLanguageFromLocale, getRSSItemsFromEntries } from "../services/feeds";
+import { isAvailableLanguage, useI18n } from "../services/i18n";
+import type { AvailableLanguage } from "../types/tokens";
+import { WEBSITE_URL } from "../utils/constants";
---
```
