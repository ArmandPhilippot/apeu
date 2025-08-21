---
"apeu": minor
---

Adds View Transitions to avoid full-page navigation refresh.

When navigating through the website, the default full-page navigation refresh was used. Because some people doesn't like that behavior, view transitions have been enabled. This uses Astro's `ClientRouter` because it offers an easy way to provide a fallback for browser that doesn't support well the view transitions.
