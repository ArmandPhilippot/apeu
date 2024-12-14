---
"apeu": minor
---

Adds support for callouts/asides in MDX.

When using MDX format, you can use a directive for your callouts (or admonitions, asides) for example:

```mdx
:::warning
The contents of the warning.
:::
```

Both custom titles and attributes are supported:

```mdx
:::idea[My custom tip]{ariaLabel: "An accessible label for my tip"}
The contents of the tip.
:::
```

Here are the supported callouts type: "critical", "discovery", "idea", "info", "success" and "warning".
