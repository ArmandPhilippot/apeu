import { expect, test } from "@playwright/test";

test("home page renders the placeholder title", async ({ page }) => {
  await page.goto("/");

  // cSpell:ignore Accueil
  await expect(page).toHaveTitle("Accueil");
});
