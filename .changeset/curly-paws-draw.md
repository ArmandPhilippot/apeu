---
"apeu": patch
---

Adds Bluesky, WhatsApp, and email as social media links allowed for authors

Support for those social media was already configured but the `authors` collection was missing the matching properties in `socialMedia`. If you use any of those social media, you can now update your author file to include them:

```diff
{
  "firstName": "John",
  "lastName": "Doe",
  "socialMedia": {
+    "bluesky": "https://bsky.app/profile/your.handle",
+    "email": "mailto:dontSpamMe@example.test",
    "github": "https://github.com/YourHandle",
+    "whatsapp": "whatever-the-format-is",
  },
  /* ... */
}

```
