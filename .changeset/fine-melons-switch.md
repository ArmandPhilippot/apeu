---
"apeu": minor
---

Switches to Astro built-in type-safe environment variables

Previously, some environment variables such as the SMTP credentials were using `process.env`. This required to use tools like `dotenvx` to load them from a `.env` file. Using Astro built-in features, they are now directly loaded which should improve DX. This also means providing those environment variables is now required and a build will fail if they are not set.
