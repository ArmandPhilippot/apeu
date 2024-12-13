---
"apeu": minor
---

Adds a Rehype plugin to convert fenced code blocks to a CodeBlock component in MDX files.

When using MDX, you can pass props to the `CodeBlock` component after the opening code fence. For example:

````mdx
```js showLineNumbers filePath=./hello-world.js
console.log("Hello, world!");
```
````

This fenced code block will output `console.log("Hello, world!");` using Javascript syntax highlighting, numbered lines and will indicate that the code is a snippet from the `./hello-world.js` file.
