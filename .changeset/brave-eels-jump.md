---
"apeu": patch
---

Enables SVG processing in dev through `image.dangerouslyProcessSVG`.

Fixing the double image processing in `Img.astro` surfaced an issue with SVG images that was previously swallowed silently. SVGs are now processed in dev mode only to be able to use SVGs as image fixtures.
