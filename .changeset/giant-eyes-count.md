---
"apeu": patch
---

Fixes an issue where the title tag suffix wasn't correctly applied.

The English homepage unexpectedly showing the site name suffix in its title, and stories were missing the suffix in their title tags. The homepage is now flagged explicitly by the view that renders it, instead of being inferred from a URL comparison.
