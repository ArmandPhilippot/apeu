import { expect, test } from "@playwright/test";

/* Pagefind owns the search input and results markup, so these locators
 * use Pagefind's documented class names rather than roles. */
test.describe("Search", () => {
  test("renders the French search page with the search widget", async ({
    page,
  }) => {
    await page.goto("/recherche/");

    await expect(page).toHaveTitle("Recherche | Armand Philippot");
    await expect(
      page.getByRole("heading", { level: 1, name: "Recherche" })
    ).toBeVisible();
    await expect(page.locator(".pagefind-ui__search-input")).toBeVisible();
  });

  test("shows results when typing a query (French)", async ({ page }) => {
    await page.goto("/recherche/");

    await page.locator(".pagefind-ui__search-input").fill("Blog");

    await expect(
      page.locator(".pagefind-ui__result-link").first()
    ).toBeVisible();
  });

  test("renders the English search page with the search widget", async ({
    page,
  }) => {
    await page.goto("/en/search/");

    await expect(page).toHaveTitle("Search | Armand Philippot");
    await expect(
      page.getByRole("heading", { level: 1, name: "Search" })
    ).toBeVisible();
    await expect(page.locator(".pagefind-ui__search-input")).toBeVisible();
  });

  test("shows results for a query passed via the URL", async ({ page }) => {
    await page.goto("/en/search/?q=Blog");

    await expect(
      page.locator(".pagefind-ui__result-link").first()
    ).toBeVisible();
  });
});
