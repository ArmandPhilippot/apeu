---
"apeu": major
---

Moves feeds and i18n helpers.

The feeds and i18n helpers were previously located respectively in `src/utils/feeds` and `src/utils/i18n.ts`. They have been moved to `src/services/feeds` and `src/services/i18n`. This seems semantically better and make splitting the files easier.

If you had templates relying on those helpers, you need to update your code:
```diff
---
-import { getFeedLanguageFromLocale, getRSSItemsFromEntries } from "../utils/feeds";
-import { isAvailableLanguage, useI18n, type AvailableLanguage } from "../utils/i18n";
+import { getFeedLanguageFromLocale, getRSSItemsFromEntries } from "../services/feeds";
+import { isAvailableLanguage, useI18n } from "../services/i18n";
+import type { AvailableLanguage } from "../types/tokens";
---
```
