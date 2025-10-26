---
"apeu": major
---

Replaces the `component-stories` integration with a new `astro-stories` integration.

This is a breaking change related to stories writing. Instead of using `.astro` files, you should now write your stories using MDX. In addition, you no longer need to write the stories indexes yourself! This improves the authoring experience and offers more flexibility to store the stories.

Your component/view stories can stay in the same place as before but you'll need to convert them to MDX. The following frontmatter properties are supported:
* `title`: to define the title of your story
* `wrapInLayout: false`: to prevent the story to be wrapped in a layout, useful for stories related to the global layout.
* `wrapInPage: false`: to prevent the story to be wrapped in a page component, useful for stories related to page layouts.

If you had stories in `src/pages/_dev_design-system`, you'll need to convert them to MDX and to move them to `src/stories`.

When writing a story, you can use `.stories.mdx` as extension to keep the file alongside your components and views, or use `.mdx` in a `stories` directory in your source directory. Any `stories` directory will be automatically stripped, except if you have a component in a directory named `stories`.
