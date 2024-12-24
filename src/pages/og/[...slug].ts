import { OGImageRoute as oGImageRoute } from "astro-og-canvas";
import { queryCollection } from "../../lib/astro/collections";

const collections = await queryCollection([
  "blogCategories",
  "blogPosts",
  "guides",
  "notes",
  "pages",
  "projects",
  "tags",
]);
const getPageIdFromRoute = (route: string) => {
  const routeWithoutLeadingSlash = route.slice(1);
  const isDefaultHomePage = !routeWithoutLeadingSlash;
  const homeId = "home";

  if (isDefaultHomePage) return homeId;

  const isOtherLocaleHomePage = routeWithoutLeadingSlash.endsWith("/");

  if (isOtherLocaleHomePage) return `${routeWithoutLeadingSlash}${homeId}`;

  return routeWithoutLeadingSlash;
};
const individualPages = collections.entries.map(
  ({ description, id, route, title }) => {
    const pageId = getPageIdFromRoute(route);

    return [pageId || "home", { description, id, title }];
  },
);

console.log(individualPages);

export const { getStaticPaths, GET } = oGImageRoute({
  param: "slug",
  pages: Object.fromEntries(individualPages),
  getImageOptions: (_path, page) => {
    return {
      title: page.title,
      description: page.description,
      logo: {
        path: "./src/pages/og/_images/logo.png",
      },
      bgImage: {
        path: "./src/pages/og/_images/bg.png",
      },
      border: {
        color: [18, 77, 104],
        width: 20,
      },
      font: {
        title: {
          families: ["Inter"],
          color: [18, 77, 104],
          weight: "Bold",
          size: 64,
          lineHeight: 1.5,
        },
        description: {
          families: ["Inter"],
          color: [28, 31, 33],
          weight: "Normal",
          size: 40,
          lineHeight: 1.5,
        },
      },
      fonts: ["./public/fonts/Inter/Inter.woff2"],
      padding: 50,
    };
  },
});
