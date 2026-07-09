import { expect, test } from "@playwright/test";
import en from "../../src/translations/en.json" with { type: "json" };
import fr from "../../src/translations/fr.json" with { type: "json" };
import { LOCALE_DISPLAY_NAMES } from "../../src/utils/constants.ts";

test.describe("Language switcher", () => {
  test("switches from the English post to its French translation", async ({
    page,
  }) => {
    await page.goto("/en/blog/posts/post1/");

    await page
      .getByRole("combobox", { name: en["form.settings.label.language"] })
      .selectOption({ label: LOCALE_DISPLAY_NAMES.fr });

    await expect(page).toHaveURL("/blog/articles/post1/");
  });

  test("switches from the French post to its English translation", async ({
    page,
  }) => {
    await page.goto("/blog/articles/post1/");

    await page
      .getByRole("combobox", { name: fr["form.settings.label.language"] })
      .selectOption({ label: LOCALE_DISPLAY_NAMES.en });

    await expect(page).toHaveURL("/en/blog/posts/post1/");
  });
});
