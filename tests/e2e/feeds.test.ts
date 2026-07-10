import { expect, test } from "@playwright/test";

/* `getCollectionsFeeds` lists a fixed set of 8 site-section feeds plus one
 * feed per tag/category, which grows over time. This checks a lower bound, not
 * an exact count. */
const MINIMUM_FEED_LINKS = 8;

// cSpell:ignore abonner
test.describe("Feeds", () => {
  test("renders the French feeds page with its feed links", async ({
    page,
  }) => {
    await page.goto("/flux/");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Flux | Armand Philippot");
    await expect(
      main.getByRole("heading", { level: 1, name: "Flux" })
    ).toBeVisible();

    await expect(
      main.getByRole("link", { name: "S’abonner au flux du site web" })
    ).toHaveAttribute("href", "/feed.xml");

    const feedLinks = main.getByRole("listitem").getByRole("link");

    expect(await feedLinks.count()).toBeGreaterThanOrEqual(MINIMUM_FEED_LINKS);
    await expect(
      main.getByRole("link", { name: "Flux de Notes" })
    ).toHaveAttribute("href", "/notes/feed.xml");
  });

  test("renders the English feeds page with its feed links", async ({
    page,
  }) => {
    await page.goto("/en/feeds/");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Feeds | Armand Philippot");
    await expect(
      main.getByRole("heading", { level: 1, name: "Feeds" })
    ).toBeVisible();

    await expect(
      main.getByRole("link", { name: "Subscribe to website's feed" })
    ).toHaveAttribute("href", "/en/feed.xml");

    const feedLinks = main.getByRole("listitem").getByRole("link");

    expect(await feedLinks.count()).toBeGreaterThanOrEqual(MINIMUM_FEED_LINKS);
    await expect(
      main.getByRole("link", { name: "Notes feed" })
    ).toHaveAttribute("href", "/en/notes/feed.xml");
  });
});
