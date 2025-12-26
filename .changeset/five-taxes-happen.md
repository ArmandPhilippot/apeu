---
"apeu": major
---

Refactors CSS tokens.

This is mostly an internal change but if you were extending this template using existing CSS tokens, you might need to update your project. All `subtle` and `faded` color variants have been replaced with `low` and `high`. In addition, some colors have been removed or replaced with new colors.

Please check your styles and make the necessary changes. For example:

```diff
- color: var(--color-black-subtle);
+ color: var(--color-slate-high);
- color: var(--color-black-faded);
+ color: var(--color-slate-low);
```
