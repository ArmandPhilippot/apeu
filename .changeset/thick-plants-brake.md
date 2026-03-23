---
"apeu": patch
---

Fixes a regression where the build was failing because of environment variables.

In some context such as Docker, the build was failing because environment variables were validated too early. The fix is to revert the changes related to `CONTENT_PATH`. If you need a different content path, you must pass it before the `dev` or `build` command:

```sh
CONTENT_PATH="./custom-directory" pnpm dev
```
