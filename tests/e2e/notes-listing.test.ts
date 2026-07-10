import { expect, test } from "@playwright/test";
import en from "../../src/translations/en.json" with { type: "json" };
import fr from "../../src/translations/fr.json" with { type: "json" };

/* Notes accumulate over time, so this checks structure only (title, total count
 * pattern, at least one card) */
test.describe("Notes listing", () => {
  test("renders the French notes listing", async ({ page }) => {
    await page.goto("/notes/");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Notes | Armand Philippot");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText("Notes");
    await expect(main.getByText(/^\d+ notes?$/)).toBeVisible();
    await expect(main.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("navigates to a note's page when clicking its read-more link (French)", async ({
    page,
  }) => {
    await page.goto("/notes/");

    /* ListingPage itself renders as an <article>, and each card does too,
     * so the cards must be queried as nested articles to skip the wrapper. */
    await page
      .getByRole("main")
      .getByRole("article")
      .getByRole("article")
      .first()
      .getByRole("link")
      .filter({ hasText: fr["cta.read.more"] })
      .click();

    await expect(page).toHaveURL(/\/notes\/.+$/);
  });

  test("renders the English notes listing", async ({ page }) => {
    await page.goto("/en/notes/");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Notes | Armand Philippot");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText("Notes");
    await expect(main.getByText(/^\d+ notes?$/)).toBeVisible();
    await expect(main.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("navigates to a note's page when clicking its read-more link (English)", async ({
    page,
  }) => {
    await page.goto("/en/notes/");

    await page
      .getByRole("main")
      .getByRole("article")
      .getByRole("article")
      .first()
      .getByRole("link")
      .filter({ hasText: en["cta.read.more"] })
      .click();

    await expect(page).toHaveURL(/\/en\/notes\/.+$/);
  });
});
