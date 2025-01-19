---
"apeu": patch
---

Fixes images performance by using picture and srcset.

This enables the experimental `responsiveImages` feature of Astro in addition to wrapping all images in a picture element to provide multiple sources. This also adds a `srcset` attribute to images to try to please a bit more Lighthouse.
