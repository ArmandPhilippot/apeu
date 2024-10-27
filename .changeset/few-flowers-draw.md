---
"apeu": minor
---

Adds CSS tokens for colors, borders, fonts, spacings and shadows.

Instead of using fixed values in your components and layouts styles, you should use tokens. This ensures harmonization within the site for colors, spaces, fonts, etc. Also, this is easier to update if needed.

```diff
---
---

<button class="btn"><slot /></button>

<style>
    .btn {
-        padding: 1rem;
-        background: #fff;
-        border: 1px solid #ccc;
-        font-size: 16px;
+        padding: var(--spacing-md);
+        background: var(--color-regular);
+        border: var(--border-size-sm) solid var(--color-border);
+        font-size: var(--font-size-md);
    }
</style>
```
