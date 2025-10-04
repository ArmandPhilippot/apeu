---
"apeu": patch
---

Fixes a performance issue on mobile devices caused by SVG filters.

The SVG filters inlined in the HTML was causing different performance issue on mobile devices. With this fix:
* Firefox should no longer struggle to display the text while scrolling
* Chrome should no longer 
