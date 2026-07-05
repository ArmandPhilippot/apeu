---
"apeu": patch
---

Processes SVG source images through the image pipeline in dev.

Fixing the double image processing in `Img.astro` surfaced an issue with SVG images that was previously swallowed silently. SVGs are now processed by Astro's image pipeline in dev through `image.dangerouslyProcessSVG`. This only applies in development. Production builds are unaffected as this can be a security risk.
