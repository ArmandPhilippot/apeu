---
"apeu": minor
---

Replaces remark/rehype plugins with mdast/hast plugins.

This project has been upgraded to Astro v7, which uses a new Markdown pipeline by default. The unified pipeline (remark/rehype) is slower, so existing plugins have been replaced with Sätteri's mdast/hast plugins.

This means you can no longer add remark/rehype plugins. You either need to convert your plugins to mdast/hast or remove this project's plugins to keep using your unified pipeline.
