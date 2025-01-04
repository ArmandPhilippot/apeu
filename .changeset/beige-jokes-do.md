---
"apeu": minor
---

Adds support for custom components in MDX without the need of imports.

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
