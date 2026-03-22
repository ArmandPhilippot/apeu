---
"apeu": patch
---

Uses `.woff` fonts instead of `.woff2`.

Satori doesn't support `.woff2` fonts. To avoid downloading the Inter font twice, I swapped the default font format (`.woff2`) with `.woff`. This is only effective for the regular font, not for the monospace font.
