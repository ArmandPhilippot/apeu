# apeu

## 1.0.2

### Patch Changes

- 9f87ca4: Fixes an issue where CONTENT_PATH was no longer defined when using this project as a Git submodule.

## 1.0.1

### Patch Changes

- f048cca: Removes the notes from the global feed.

  I'm using them as "personal" notes so I think they shouldn't be in the feed. If someone wants to subscribe to my notes, it's still possible using the individual feed.

- 20e4205: Fixes a style issue in code blocks preventing the line numbers and prompts to stay sticky while scrolling horizontally.
- 7720df5: Adds missing cover on individual pages (posts, guides and projects).
- 20e4205: Fixes a style issue when using diff notation inside code blocks.

  This fixes an issue where the lines marked as diff were not taking the full width of their parent, so the background was not displayed correctly.

- 0da391f: Improves the differentiation of RSS items by prefixing their title with the content type.

  Since I have some collections that target external resources (e.g. "John Doe" being in the blog roll), it might be confusing for someone subscribed to the RSS feed to see only "John Doe". By prefixing the title with the content type (e.g. "[Blogroll] John Doe"), it should prevent any confusion.

- 20e4205: Fixes the text alignment inside code blocks' caption.
- 993be5e: Fixes a style issue in callouts where the last child could add an extra margin.
- 7720df5: Fixes images performance by using picture and srcset.

  This enables the experimental `responsiveImages` feature of Astro in addition to wrapping all images in a picture element to provide multiple sources. This also adds a `srcset` attribute to images to try to please a bit more Lighthouse.

- 993be5e: Fixes a style issue in callouts where a long heading was not correctly aligned with the icon.

## 1.0.0

### Major Changes

- 3967fcc: Sets French version as the default language.

### Minor Changes

- 1d920ee: Adds all (global + per collection) RSS feeds.
- 1349da2: Adds support for custom components in MDX without the need of imports.

  Here a list of the syntax automatically mapped to a custom component:

  | Markdown/HTML | Component   |
  | ------------- | ----------- |
  | a             | Link        |
  | blockquote    | Blockquote  |
  | callout       | Callout     |
  | div           | Placeholder |
  | figure        | Figure      |
  | h2            | H2          |
  | h3            | H3          |
  | h4            | H4          |
  | h5            | H5          |
  | h6            | H6          |
  | img           | Img         |
  | li            | ListItem    |
  | ol            | Ol          |
  | ul            | List        |

  The use of `div` is a bit special: according to its class, it could be a custom component or a div. For example, when using `gallery` as class, the `div` will be replace with a `Grid` component.

- e9314a4: Upgrades to Astro v5.
- 3967fcc: Adds French version.
- 4af7172: Replaces static rendering with hybrid rendering to support API endpoints.

  This project now uses Node.js adapter to handle on-demand pages like API endpoints.

- e1efe03: Adds a Search page.
- f700427: Adds `queryCollection` and `queryEntry` helpers to reduce boilerplate code when querying collections entries.

  Instead of using directly the `getCollection` helper from Astro, you should use the `queryCollection` helper declared in this project. This function helps you query a collection with filters, offset and ordering. `queryCollection` will also resolves every references!

  You can also use it if you need to resolve multiple collections at once or you can use `queryEntry` to resolve a single entry.

  You can now reduce the amount of code in your templates:

  ```astro
  ---
  import { queryCollection } from "src/lib/astro/collections/query-collection";
  const { entries, total } = await queryCollection("blogPosts", {
    first: 10,
    orderBy: { key: "publishedOn", order: "DESC" },
  });
  ---

  // Your template here
  ```

  Instead of:

  ```astro
  ---
  import { getCollection, getEntries, getEntry } from "astro:content";
  const rawBlogPosts = await getCollection("blogPosts");
  const blogPosts = await Promise.all(
    rawBlogPosts.map(async (blogPost) => {
      const category = blogPost.data.category
        ? await getEntry(blogPost.data.category)
        : null;
      const tags = blogPost.data.tags
        ? await getEntries(blogPost.data.tags)
        : null;
      return {
        ...blogPost,
        data: {
          ...blogPost.data,
          category,
          tags,
        },
      };
    }),
  );
  const orderedBlogPosts = blogPosts.sort(/* some method to sort posts */);
  const firstTenBlogPosts = orderedBlogPosts.slice(0, 10);
  ---

  // Your template here
  ```

- 5a080c0: Adds support for dev-only pages.

  To use this feature, you need to add a new integration in your configuration file:

  ```diff
  import { defineConfig } from "astro/config";
  +import { devOnlyPages } from "./src/lib/astro/integrations/dev-only-pages";

  export default defineConfig({
  +  integrations: [
  +    devOnlyPages({
  +      prefix: "_dev_",
  +    }),
  +  ],
  });
  ```

  You can now create pages without adding them to the final build by using the `_dev_` prefix. To access those pages in your browser, just use the filename without the prefix (e.g. `/src/pages/_dev_design-system` can be accessed using `/design-system` as slug).

- 5a080c0: Adds CSS tokens for colors, borders, fonts, spacings and shadows.

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

- d8654ed: Adds a `PageLayout` component to define global structure and styles for pages.
- 508521e: Adds Schema.org structured data.
- 5dd33bf: Adds support for switching theme between light and dark.

  ou can choose to use either a light, a dark theme or to let the theme being updated according to your OS preferences. This feature is especially useful when you want to change the theme depending on the time of day.

- 2000005: Adds support to redirect to a translated page using the language picker.

  Previously, when using the language picker, the user was redirected to the homepage of the selected locale. Now, it is possible to redirect to the matching translated page.

  For example, if an user lands on `/en/blog/posts`, he can switch to `/fr/blog/articles` instead! If a translated route is not provided, the user will be redirected to the homepage of the selected locale.

- 3a62260: Adds a Remark plugin to retrieve the words count from Markdown files.

  This plugin allows the calculation of a new reading time meta using the number of words in a Markdown file.

- 1d5eea9: Adds the website navbar.

  A stub was previously here. This adds the popover functionality and the different behavior depending on the viewport size.

- 6556bab: Adds independent theme mode support for code blocks.

  A new setting is available in the website header and in each code block to update the theme used for code blocks. This allows users to use a light theme for the website and a dark theme for the code blocks, and conversely. It is also possible to infer the code block theme from the website theme when set to `Auto`.

- 6bd1f12: Defines content collections schemas.

  The following collections are now available: `authors`, `blogroll`, `bookmarks`, `blogCategories`, `blogPosts`, `guides`, `notes`, `projects` and `tags`. To define contents for these collections, your content directory should use the following structure:

  ```
  content/
  ├── authors/
  │   └── john-doe.json
  ├── blogroll/
  │   ├── index.md
  │   └── blog1.json
  ├── bookmarks/
  │   ├── index.md
  │   └── bookmark1.json
  └── en/
      ├── blog/
      │   ├── categories/
      │   │   ├── index.md
      │   │   └── category1.md
      │   ├── posts/
      │   │   ├── index.md
      │   │   └── post1.md
      │   └── posts/
      ├── guides/
      │   ├── index.md
      │   └── guide1.md
      ├── notes/
      │   ├── index.md
      │   └── note1.md
      ├── pages/
      │   ├── home.md
      │   └── search.md
      ├── projects/
      │   ├── index.md
      │   └── project1.md
      └── tags/
          ├── index.md
          └── tag1.md
  ```

  There are two types of pages available:

  - the pages co-located with your collection (to provide meta and optional content for the index page) named `index.md`
  - the ones located in the `pages` directory and that can use any filename

- 15a3611: Adds support for i18n.

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

- b63d9f9: Adds a Layout component to define global structure and styles.
- 6556bab: Adds a custom CodeBlock component.

  The `CodeBlock` component should be used instead of the Astro default one. It provides the following features:

  - snippet file path
  - prompt for shell and sql sessions with custom user/host
  - line numbers with custom line start if needed
  - diff notation
  - light/dark theme switch
  - copy to clipboard button

- 85b350c: Adds support for callouts/asides in MDX.

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

- 4af7172: Adds an API route to handle sending emails.
- 9d143b2: Adds support for MDX files in content directory.

  With Astro, it is not possible to use custom components while using `.md` extension. So this adds support for `.mdx` files in content collections. However, I don't want to rely on imports inside the content directory so a few customizations have been added:

  - both Markdown syntax and HTML tags are supported with custom components,
  - images using relative paths will automatically be imported,
  - images wrapped in a link pointing to the image source will automatically be updated with the built image path.

- 26eb807: Adds a new page to display available feeds on the website.
- e1efe03: Adds an Astro integration to generate the search index on build.

  Using the Pagefind integration, the search index can be automatically built while building the website. On dev mode, you'll need to build your website a first time. Otherwise, the integration will warn you that the search index cannot be used.

- 6556bab: Adds a Rehype plugin to convert fenced code blocks to a CodeBlock component in MDX files.

  When using MDX, you can pass props to the `CodeBlock` component after the opening code fence. For example:

  ````mdx
  ```js showLineNumbers filePath=./hello-world.js
  console.log("Hello, world!");
  ```
  ````

  This fenced code block will output `console.log("Hello, world!");` using Javascript syntax highlighting, numbered lines and will indicate that the code is a snippet from the `./hello-world.js` file.

- 811b93a: Creates the pages for each existing collection.

  The website now has pages for each collection, including index pages (paginated or not) and dynamic routes.

- cd73d5d: Adds a custom 404 page.
- 5a080c0: Adds support for components stories.

  To enable this feature, you need to import and add the integration in your configuration file:

  ```diff
  import { defineConfig } from "astro/config";
  +import { componentsStories } from "./src/lib/astro/integrations/components-stories";

  export default defineConfig({
  +  integrations: [
  +    componentsStories({
  +      components: "./path/to/components/directory",
  +    }),
  +  ],
  });
  ```

  You can now define stories for your components using the `.stories.astro` extension. Your story file should look like any Astro page. The only differences are:

  - they can be injected under a parent slug (e.g. `/design-system`),
  - their purpose is to show your component variants and to give advices about their use.

  You can also divide your stories in multiple files. Here are the supported structures:

  ```text
  /src/components
  ├── button/
  │   ├── stories/
  │   │   ├── primary-button.stories.astro
  │   │   └── secondary-button.stories.astro
  │   ├── button.astro
  │   └── button.stories.astro
  ├── field/
  │   ├── stories/
  │   │   ├── numeric-field.stories.astro
  │   │   ├── text-field.stories.astro
  │   │   └── index.stories.astro
  │   └── field.astro
  └── link/
      ├── link.astro
      └── link.stories.astro
  ```

  Those structures will be available with the following slugs:

  - /button
  - /button/primary-button
  - /button/secondary-button
  - /field
  - /field/numeric-field
  - /field/text-field
  - /link

  You can use the `baseSlug` option to injects those route under another route. For example, using `baseSlug: '/design-system'`, the previous slugs would be updated to:

  - /design-system/button
  - /design-system/button/primary-button
  - /design-system/button/secondary-button
  - /design-system/field
  - /design-system/field/numeric-field
  - /design-system/field/text-field
  - /design-system/link

- 2000005: Adds an `i18n` frontmatter property to define the translations.

  This property accepts a partial object with the available locales as key and a reference to a translated entry as value. This is used both to define the alternate languages in the `<head>` tag and to redirect to the right page using the `LanguagePicker`.

- 156da90: Adds a favicon and handle sitemap, robots.txt and manifest.json files generation on build.
- 6bd1f12: Adds an environment variable to configure the content directory path.

  By default, this project will look for contents in `./content`. If you want to define another base path, you can use an environment variable named `CONTENT_PATH` (see `.env.example`).

  This can be useful to define different data between development and production for example.

- 9a73c5a: Adds open graph and twitter meta.
- 6b1ae83: Adds an helper to build a table of contents from Markdown headings.

### Patch Changes

- 5ed5609: Adds a missing MDX renderer to generate feed entries content.
- 095b57a: Fixes code blocks overflow in Chromium.
- 5c7eed5: Hides JS-only features when Javascript is disabled.

  When Javascript is disabled the contact form is unusable, so I added a `noscript` text to inform the user. I also choose to hide the search and settings form since they can't be use without JS.

- 2000005: Adds support for filtering tags that does not match the current locale.

  The `queryCollection` utility was returning the entries without checking the data inside. For `bookmarks`, the `tags` property can contain tags in different locales. So using `where: {locale: "fr"}`, we now filter the tags to return only the ones matching the given locale.

- ed8bdea: Fixes the formatting of RSS items content.

  RSS readers are not smart enough to replace the relative URLs with an absolute one, so links and images are now using a full URL. I also removed unwanted elements (e.g. code blocks) and data attributes.

- 38087f2: Fixes an issue where `content:encoded` was included in RSS feed items while the content was empty.

  When content is passed to `@astrojs/rss` while being empty, it results to a self-closed `<content:encoded />` without the proper `xmlns` definition. So we need to make sure `content` exist before passing it.

- b56c083: Fixes a contact form issue where environment variables was not available in a Docker container.
- 2000005: Adds support for filtering blogroll by locale.

  Currently, when a blog have a description only in one locale, it is displayed in the blogroll for all locales. The `locale` filter is never applied for the blogs.

  With this fix, we can now filter the blogs by locale with `queryCollection`. If a blog does not have a description in the current locale, it will not be returned.

- 80dc4c1: Fixes dates formatting coming from content collections.

  When using dates like `"2025-01-07T13:40"` in a collection entry, they were converted to a Date object with GMT timezone. With this fix, it is now possible to apply a timezone! Instead of `Tue, 07 Jan 2025 13:40:00 GMT`, you can get `Tue, 07 Jan 2025 13:40:00 GMT+1` if the timezone is configured to `Europe/Paris` while in winter. It should also handle daylight saving time, so `"2025-08-07T13:40"` should be converted to `Tue, 07 Aug 2025 13:40:00 GMT+2` if the timezone is configured to `Europe/Paris`.
