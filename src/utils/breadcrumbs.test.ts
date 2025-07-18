import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RouteIndexItem } from "../types/data";
import { getBreadcrumb } from "./breadcrumb";
import * as routes from "./routes";
import type { AvailableLanguage } from "./i18n";

vi.mock("./routes", async () => {
  const actual = await vi.importActual<typeof import("./routes")>("./routes");

  return {
    ...actual,
    isLocalizedRoute: vi.fn((route: string) => route.startsWith("/en")),
    normalizeRoute: vi.fn((route: string) => route.replace(/\/+$/, "") || "/"),
  };
});

const createRouteIndex = (
  items: RouteIndexItem[]
): Map<string, RouteIndexItem> =>
  new Map(items.map((item) => [item.route, item]));

type LocalTestContext = {
  routeIndex: Map<string, RouteIndexItem>;
};

describe("getBreadcrumb", () => {
  beforeEach<LocalTestContext>((context) => {
    context.routeIndex = createRouteIndex([
      { id: "", locale: "fr", route: "/", title: "Home" },
      { id: "", locale: "en", route: "/en", title: "English" },
      { id: "", locale: "en", route: "/en/blog", title: "Blog" },
      { id: "", locale: "en", route: "/en/blog/post", title: "Post" },
      {
        id: "",
        locale: "es" as AvailableLanguage,
        route: "/es",
        title: "Français",
      },
      { id: "", locale: "fr", route: "/about", title: "About" },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it<LocalTestContext>("returns root breadcrumb for '/'", ({ routeIndex }) => {
    const result = getBreadcrumb({ route: "/", routeIndex });

    expect(result).toStrictEqual([{ label: "Home", url: "/" }]);
  });

  it<LocalTestContext>("returns breadcrumb for localized route", ({
    routeIndex,
  }) => {
    const result = getBreadcrumb({ route: "/en/blog/post/", routeIndex });

    expect(result).toStrictEqual([
      { label: "English", url: "/en" },
      { label: "Blog", url: "/en/blog" },
      { label: "Post", url: "/en/blog/post" },
    ]);
  });

  it<LocalTestContext>("returns breadcrumb for non-localized route", ({
    routeIndex,
  }) => {
    // Mock isLocalizedRoute to return false for this test
    vi.mocked(routes.isLocalizedRoute).mockReturnValueOnce(false);

    const result = getBreadcrumb({ route: "/about", routeIndex });

    expect(result).toStrictEqual([
      { label: "Home", url: "/" },
      { label: "About", url: "/about" },
    ]);
  });

  it<LocalTestContext>("returns empty breadcrumb if no entries are found", () => {
    const result = getBreadcrumb({
      route: "/unknown/route",
      routeIndex: new Map(),
    });

    expect(result).toStrictEqual([]);
  });

  it<LocalTestContext>("appends pagination label when provided", ({
    routeIndex,
  }) => {
    const result = getBreadcrumb({
      route: "/en/blog/post",
      routeIndex,
      paginationLabel: "Page 2",
    });

    expect(result).toStrictEqual([
      { label: "English", url: "/en" },
      { label: "Blog", url: "/en/blog" },
      { label: "Post", url: "/en/blog/post" },
      { label: "Page 2", url: "/en/blog/post" },
    ]);
  });

  it<LocalTestContext>("handles empty route", ({ routeIndex }) => {
    const result = getBreadcrumb({ route: "", routeIndex });

    expect(result).toStrictEqual([{ label: "Home", url: "/" }]);
  });

  it<LocalTestContext>("calls normalizeRoute once", ({ routeIndex }) => {
    getBreadcrumb({ route: "/en/blog/post/", routeIndex });

    expect(routes.normalizeRoute).toHaveBeenCalledOnce();
  });

  it<LocalTestContext>("calls isLocalizedRoute with normalized route", ({
    routeIndex,
  }) => {
    getBreadcrumb({ route: "/en/blog/post/", routeIndex });

    expect(routes.isLocalizedRoute).toHaveBeenCalledWith("/en/blog/post");
  });
});
