interface Config {
  base: string;
  stories: import("./types/internal").Stories;
}

declare module "virtual:astro-stories/config" {
  const base: Config["base"];
  const stories: Config["stories"];
  export default { base, stories };
  export { base, stories };
}

declare module "virtual:astro-stories/Layout" {
  const Layout: typeof import("./components/story-layout.astro").default;
  export default Layout;
}

declare module "*.mdx" {
  type MDX = import("astro").MDXInstance<Record<string, unknown>>;

  export const frontmatter: MDX["frontmatter"];
  export const file: MDX["file"];
  export const url: MDX["url"];
  export const getHeadings: MDX["getHeadings"];
  export const Content: MDX["Content"];
  export const components: MDX["components"];

  const load: MDX["default"];
  export default load;
}
