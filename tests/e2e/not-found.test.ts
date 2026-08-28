import { expect, test } from "@playwright/test";
import fr from "../../src/translations/fr.json" with { type: "json" };

// cSpell:ignore trouvé
const HTTP_NOT_FOUND = 404;

test.describe("Not found page", () => {
  test("renders the French 404 page for an unknown path (default locale)", async ({
    page,
  }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(HTTP_NOT_FOUND);
    await expect(page).toHaveTitle("404 - Non trouvé | Armand Philippot");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Non trouvé"
    );
    await expect(
      page
        .getByRole("main")
        .getByRole("searchbox", { name: fr["form.search.label"] })
    ).toBeVisible();
  });

  /* The Node adapter doesn't know about locale prefixes, so serving the
   * localized 404 page for an unknown /en/* path relies on a host-level
   * rewrite. Only the 404 status itself is guaranteed here. */
  test("still returns a 404 status for an unknown path under /en/", async ({
    page,
  }) => {
    const response = await page.goto("/en/this-page-does-not-exist");

    expect(response?.status()).toBe(HTTP_NOT_FOUND);
  });
});
