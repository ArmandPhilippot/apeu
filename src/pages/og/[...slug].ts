import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";

// eslint-disable-next-line camelcase -- Astro prefixes experimental helpers.
import { experimental_getFontFileURL, fontData } from "astro:assets";
import { satoriAstroOG } from "satori-astro";
import { html } from "satori-html";
import logo from "../../assets/logo-unpressed.svg?url";
import bg from "../../assets/paper-light.svg?inline";
import { queryCollection } from "../../services/collections";
import { CONFIG } from "../../utils/constants";
import { routeToParam } from "../../utils/paths";

const collections = await queryCollection([
  "blog.categories",
  "blog.posts",
  "guides",
  "index.pages",
  "notes",
  "pages",
  "projects",
  "tags",
]);
const addPngExtension = (path: string) => `${path}.png`;
const getPageIdFromRoute = (route: string) => {
  const routeId = routeToParam(route);
  const isDefaultHomePage = !routeId;
  const isLocalizedHomePage = (
    CONFIG.LANGUAGES.AVAILABLE as readonly string[]
  ).includes(routeId);
  const homeId = "home";

  if (isDefaultHomePage) return homeId;
  if (isLocalizedHomePage) return `${routeId}/${homeId}`;

  return routeId;
};
const individualPages = collections.entries.map(
  ({ description, id, route, seo, title }) => {
    const pageId = getPageIdFromRoute(route);

    return [
      addPngExtension(pageId || "home"),
      { description, id, seo, title },
    ] as const;
  }
);

export const getStaticPaths = (() => {
  const data = fontData["--font-inter"];
  const inter400Path = data.find(
    (font) => font.style === "normal" && font.weight === "400"
  )?.src[0]?.url;
  const inter600Path = data.find(
    (font) => font.style === "normal" && font.weight === "600"
  )?.src[0]?.url;

  if (inter400Path === undefined || inter600Path === undefined) {
    throw new Error("Cannot generate OG images because the font is missing.");
  }

  return individualPages.map(([slug, page]) => {
    return {
      params: {
        slug,
      },
      props: {
        inter400Path,
        inter600Path,
        page,
      },
    };
  });
}) satisfies GetStaticPaths;

const replaceNonBreakingSpaces = (str: string) =>
  str.replaceAll(" ", " ").replaceAll(" ", " ");

/**
 * Generates Open Graph images.
 *
 * @param {import("astro").APIContext} ctx - The Astro API context.
 * @returns {Promise<Response>} The response to generate OG images.
 */
export const GET = (async ({ props, url }) => {
  const inter400Url = experimental_getFontFileURL(props.inter400Path, url);
  const inter400Data = await fetch(inter400Url).then(async (res) =>
    res.arrayBuffer()
  );

  const inter600Url = experimental_getFontFileURL(props.inter600Path, url);
  const inter600Data = await fetch(inter600Url).then(async (res) =>
    res.arrayBuffer()
  );

  return satoriAstroOG({
    template: html`
      <div
        style="display: flex; flex-flow: column; gap: 4rem; height: 100%; padding: 3rem 4rem 3rem 3rem; background-image: url(${bg}); border: 0.5rem solid #13436c; font-family: Inter; font-size: 16px;"
      >
        <img src="${logo}" width="8%" style="aspect-ratio: 1/1;" />
        <div style="display: flex;  flex-flow: column;">
          <h1 style="color: #13436c; font-size: 3.5rem; font-weight: bold;">
            ${replaceNonBreakingSpaces(props.page.title)}
          </h1>
          <p style="font-size: 2.25rem; line-height: 1.618;">
            ${replaceNonBreakingSpaces(
              props.page.seo.description ?? props.page.description
            )}
          </p>
        </div>
      </div>
    `,
    width: 1200,
    height: 630,
  }).toResponse({
    satori: {
      fonts: [
        {
          name: "Inter",
          data: inter400Data,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: inter600Data,
          style: "normal",
          weight: 600,
        },
      ],
    },
  });
}) satisfies APIRoute<InferGetStaticPropsType<typeof getStaticPaths>>;
