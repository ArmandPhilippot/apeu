---
"apeu": minor
---

Adds support for MDX files in content directory.

With Astro, it is not possible to use custom components while using `.md` extension. So this adds support for `.mdx` files in content collections. However, I don't want to rely on imports inside the content directory so a few customizations have been added:

- both Markdown syntax and HTML tags are supported with custom components,
- images using relative paths will automatically be imported,
- images wrapped in a link pointing to the image source will automatically be updated with the built image path.
