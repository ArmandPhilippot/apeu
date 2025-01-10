---
"apeu": patch
---

Fixes dates formatting coming from content collections.

When using dates like `"2025-01-07T13:40"` in a collection entry, they were converted to a Date object with GMT timezone. With this fix, it is now possible to apply a timezone! Instead of `Tue, 07 Jan 2025 13:40:00 GMT`, you can get `Tue, 07 Jan 2025 13:40:00 GMT+1` if the timezone is configured to `Europe/Paris` while in winter. It should also handle daylight saving time, so `"2025-08-07T13:40"` should be converted to `Tue, 07 Aug 2025 13:40:00 GMT+2` if the timezone is configured to `Europe/Paris`.
