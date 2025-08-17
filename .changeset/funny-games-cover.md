---
"apeu": major
---

Moves i18n helpers.

The i18n helpers were previously located in `src/utils/i18n.ts` and has been moved to `src/services/i18n`. This seems semantically better and make splitting the file easier.

If you had templates relying on `useI18n` or others i18n helpers, you need to update your code:
```diff
---
-import { isAvailableLanguage, useI18n, type AvailableLanguage } from "../utils/i18n";
+import { isAvailableLanguage, useI18n } from "../services/i18n";
+import type { AvailableLanguage } from "../types/tokens";
---
```
