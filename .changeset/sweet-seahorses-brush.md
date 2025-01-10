---
"apeu": patch
---

Fixes an issue where `content:encoded` was included in RSS feed items while the content was empty.

When content is passed to `@astrojs/rss` while being empty, it results to a self-closed `<content:encoded />` without the proper `xmlns` definition. So we need to make sure `content` exist before passing it.
