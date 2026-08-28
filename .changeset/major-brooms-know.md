---
"apeu": minor
---

Enforces trailing slash on routes.

Previously, routes could be accessed with or without a trailing slash. This change enforces trailing slashes on all routes except file endpoints. This can help with SEO and consistency.

If you have links pointing to routes without trailing slashes, you may need to update them to include the trailing slash or set up redirects at the hosting level to ensure they resolve correctly.
