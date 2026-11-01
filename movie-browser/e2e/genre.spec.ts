import { expect, test } from "@playwright/test";

test.describe("Genres", () => {
  test("clicking a genre shows its movies and highlights it", async ({ page }) => {
    await page.goto("/");

    const genres = page.getByRole("navigation", { name: "Genres" });
    await genres.getByRole("link", { name: "Action" }).click();

    await expect(page).toHaveURL("/genre/28");
    await expect(page).toHaveTitle("Action movies | Movie Browser");
    await expect(page.getByRole("heading", { name: "Action movies" })).toBeVisible();
    await expect(page.locator('main a[href^="/movie/"]').first()).toBeVisible();

    // The active genre is marked with aria-current="page"
    await expect(genres.getByRole("link", { name: "Action" })).toHaveAttribute("aria-current", "page");
    await expect(genres.getByRole("link", { name: "Comedy" })).not.toHaveAttribute("aria-current");
  });

  test("pagination moves between pages", async ({ page }) => {
    await page.goto("/genre/28");
    const pagination = page.getByRole("navigation", { name: "Pagination" });

    // Page 1: Prev is disabled
    await expect(pagination.getByText("← Prev")).toHaveAttribute("aria-disabled", "true");

    await pagination.getByRole("link", { name: "Next →" }).click();
    await expect(page).toHaveURL("/genre/28?page=2");
    await expect(pagination.locator('[aria-current="page"]')).toHaveText("2");

    await pagination.getByRole("link", { name: "← Prev" }).click();
    await expect(page).toHaveURL("/genre/28"); // page 1 has a clean URL
  });

  test("a page number above 500 is capped at 500", async ({ page }) => {
    await page.goto("/genre/28?page=9999");
    const pagination = page.getByRole("navigation", { name: "Pagination" });
    await expect(pagination.locator('[aria-current="page"]')).toHaveText("500");
  });
});
