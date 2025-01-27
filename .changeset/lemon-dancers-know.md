---
"apeu": patch
---

Fixes an issue where pagination styles was overridden by other styles in production.

The CSS order seems a bit inconsistent between development and production modes. The style for pagination links was not correctly applied to the built website.
