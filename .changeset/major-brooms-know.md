---
"apeu": minor
---

Enforces trailing slash on routes.

Previously, trailing slashes were not enforced. This meant that routes could be accessed with or without a trailing slash. This change enforces trailing slashes on all routes (except file endpoints such as `feed.xml`), which can help with SEO and consistency.

However, due to a bug in Astro, `trailingSlash` cannot be set to `always`. This means that while the intention is to have trailing slashes for all routes, it may not be fully enforced until the bug is resolved.

If you have links pointing to routes without trailing slashes, you may need to update them to include the trailing slash or set up redirects at the hosting level to ensure they resolve correctly.
