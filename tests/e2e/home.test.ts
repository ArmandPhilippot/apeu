import { expect, test } from "@playwright/test";
import en from "../../src/translations/en.json" with { type: "json" };
import fr from "../../src/translations/fr.json" with { type: "json" };

// cSpell:ignore Accueil complémentaire
test.describe("Homepage", () => {
  test("renders the French homepage (default locale) with its main sections", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Accueil");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Armand Philippot."
    );
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: fr["page.home.section.about.heading"],
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: fr["page.home.section.contact.heading"],
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Une section complémentaire",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: fr["page.home.section.collections.heading"],
      })
    ).toBeVisible();
  });

  test("navigates to the blog when clicking its link (French)", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("main")
      .getByRole("link", { name: "Blog", exact: true })
      .click();

    await expect(page).toHaveURL("/blog/");
  });

  test("renders the English homepage with its main sections", async ({
    page,
  }) => {
    await page.goto("/en/");

    await expect(page).toHaveTitle("Home");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Armand Philippot."
    );
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: en["page.home.section.about.heading"],
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: en["page.home.section.contact.heading"],
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "An additional section" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: en["page.home.section.collections.heading"],
      })
    ).toBeVisible();
  });

  test("navigates to the blog when clicking its link (English)", async ({
    page,
  }) => {
    await page.goto("/en/");

    await page
      .getByRole("main")
      .getByRole("link", { name: "Blog", exact: true })
      .click();

    await expect(page).toHaveURL("/en/blog/");
  });
});
