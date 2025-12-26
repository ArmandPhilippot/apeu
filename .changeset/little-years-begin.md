---
"apeu": patch
---

Prevents slot from being rendered as an HTML attribute.

When using the spread syntax, sometimes the Astro's `slot` attribute were being rendered as an HTML attribute. This fixes this behavior and cleans the HTML output.
