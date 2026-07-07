import { expect, test } from "@playwright/test";
import en from "../../src/translations/en.json" with { type: "json" };
import fr from "../../src/translations/fr.json" with { type: "json" };

// cSpell:ignore Catégorie matières
test.describe("Single blog post", () => {
  test("renders the French blog post with its content and category link", async ({
    page,
  }) => {
    await page.goto("/blog/articles/post1");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Article 1 | Armand Philippot");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText(
      "Article 1"
    );
    await expect(
      main.getByRole("heading", {
        level: 2,
        name: fr["collapsible.toc.title"],
      })
    ).toBeVisible();
    await expect(
      main.getByRole("heading", { level: 2, name: "Heading 1" })
    ).toBeVisible();
    await expect(
      main.getByRole("heading", { level: 2, name: "Heading 2" })
    ).toBeVisible();

    await main.getByRole("link", { name: "Catégorie 1" }).click();

    await expect(page).toHaveURL("/blog/categories/category1");
  });

  test("renders the English blog post with its content and category link", async ({
    page,
  }) => {
    await page.goto("/en/blog/posts/post1");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Post 1 | Armand Philippot");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText("Post 1");
    await expect(
      main.getByRole("heading", {
        level: 2,
        name: en["collapsible.toc.title"],
      })
    ).toBeVisible();
    await expect(
      main.getByRole("heading", { level: 2, name: "Heading 1" })
    ).toBeVisible();
    await expect(
      main.getByRole("heading", { level: 2, name: "Heading 2" })
    ).toBeVisible();

    await main.getByRole("link", { name: "Category 1" }).click();

    await expect(page).toHaveURL("/en/blog/categories/category1");
  });
});
