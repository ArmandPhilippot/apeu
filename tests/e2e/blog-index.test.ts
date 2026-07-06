import { expect, test } from "@playwright/test";
import en from "../../src/translations/en.json" with { type: "json" };
import fr from "../../src/translations/fr.json" with { type: "json" };

/* The "Recent posts" section always shows the 2 latest posts (see
 * `blog-index-view.astro`). */
const RECENT_POSTS_COUNT = 2;

// cSpell:ignore Catégorie Catégories récents
test.describe("Blog index", () => {
  test("renders the French blog index with recent posts and categories", async ({
    page,
  }) => {
    await page.goto("/blog");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Blog | Armand Philippot");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText("Blog");

    /* Posts change over time, so this asserts the count and structure rather
     * than specific titles. */
    const recentPosts = main.locator("section").filter({
      has: page.getByRole("heading", {
        level: 2,
        name: fr["page.blog.section.recent.posts.heading"],
      }),
    });

    await expect(recentPosts.getByRole("heading", { level: 3 })).toHaveCount(
      RECENT_POSTS_COUNT
    );

    const categories = main.locator("section").filter({
      has: page.getByRole("heading", {
        level: 2,
        name: fr["page.blog.section.categories.heading"],
      }),
    });

    await expect(
      categories.getByRole("heading", { level: 3, name: "Catégorie 1" })
    ).toBeVisible();
    await expect(
      categories.getByRole("heading", { level: 3, name: "Catégorie 2" })
    ).toBeVisible();

    /* Post cards render their title as plain text and expose a separate
     * "read more" CTA link instead. Whichever post is currently most recent is
     * fine. This only proves a card correctly links to its own page. */
    await recentPosts
      .getByRole("article")
      .first()
      .getByRole("link")
      .filter({ hasText: fr["cta.read.more"] })
      .click();

    await expect(page).toHaveURL(/\/blog\/articles\/.+$/);
  });

  test("renders the English blog index with recent posts and categories", async ({
    page,
  }) => {
    await page.goto("/en/blog");

    const main = page.getByRole("main");

    await expect(page).toHaveTitle("Blog | Armand Philippot");
    await expect(main.getByRole("heading", { level: 1 })).toHaveText("Blog");

    const recentPosts = main.locator("section").filter({
      has: page.getByRole("heading", {
        level: 2,
        name: en["page.blog.section.recent.posts.heading"],
      }),
    });

    await expect(recentPosts.getByRole("heading", { level: 3 })).toHaveCount(
      RECENT_POSTS_COUNT
    );

    const categories = main.locator("section").filter({
      has: page.getByRole("heading", {
        level: 2,
        name: en["page.blog.section.categories.heading"],
      }),
    });

    await expect(
      categories.getByRole("heading", { level: 3, name: "Category 1" })
    ).toBeVisible();
    await expect(
      categories.getByRole("heading", { level: 3, name: "Category 2" })
    ).toBeVisible();

    await recentPosts
      .getByRole("article")
      .first()
      .getByRole("link")
      .filter({ hasText: en["cta.read.more"] })
      .click();

    await expect(page).toHaveURL(/\/en\/blog\/posts\/.+$/);
  });
});
