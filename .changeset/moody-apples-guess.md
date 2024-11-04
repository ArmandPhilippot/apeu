---
"apeu": minor
---

Adds support for i18n.

This project now exports a `useI18n()` function to help you translating all the UI strings and routes. It accepts a locale as argument and returns a validated `locale` (which fallback to default locale) and three methods:

- `translate()`: to help you translate UI strings
- `translatePlural()`: to help you translate UI strings while dealing with pluralization
- `route()`: to help you localize the routes.

Both `translate()` and `translatePlural()` support interpolations by providing an object as second argument. For example:

```ts
import { useI18n } from "src/utils/helpers/i18n";

const { locale, route, translate, translatePlural } = useI18n("en");
console.log(locale); // "en"

const contactPage = route("contact");
console.log(contactPage); // "/contact"

const contactPageFr = route("contact");
console.log(contactPageFr); // If "fr" is defined and default locale is "en", "/fr/contact". Else "/contact";

const greeting = translate("greeting", { name: "John" });
console.log(greeting); // "Hello, John!";

const threePeopleLike = translatePlural("people.likes", { count: 3 });
console.log(threePeopleLike); // "3 people like this post"

const noLikes = translatePlural("people.likes", { count: 0 });
console.log(noLikes); // "No one like this post yet"
```
