import { expect, test } from "@playwright/test";

// test.describe groups related tests, like describe() in Vitest
test.describe("Search", () => {
  test("searching from the navbar shows results", async ({ page }) => {
    await page.goto("/");

    // Find the input by its aria-label, type, then press Enter
    const searchBox = page.getByRole("searchbox", { name: "Search movies" });
    await searchBox.fill("batman");
    await searchBox.press("Enter");

    // The URL changes and the results page appears
    await expect(page).toHaveURL("/search?q=batman");
    await expect(page).toHaveTitle("Search: batman | Movie Browser");
    await expect(page.getByRole("heading", { name: /Results for .batman./ })).toBeVisible();
    await expect(page.locator('main a[href^="/movie/"]').first()).toBeVisible();

    // The search box keeps showing what you searched for
    await expect(searchBox).toHaveValue("batman");
  });

  test("special characters in the search work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox", { name: "Search movies" }).fill("fast & furious");
    await page.getByRole("searchbox", { name: "Search movies" }).press("Enter");

    await expect(page).toHaveURL("/search?q=fast%20%26%20furious");
    await expect(page.getByRole("heading", { name: /Results for .fast & furious./ })).toBeVisible();
  });

  test("shows a hint when there is no search yet", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText("Type a movie name in the search bar to get started.")).toBeVisible();
  });

  test("shows a message when nothing is found", async ({ page }) => {
    await page.goto("/search?q=zzqxjvkwplm");
    await expect(page.getByText("No movies found. Try a different title.")).toBeVisible();
  });

  test("pagination goes to the next page and keeps the search", async ({ page }) => {
    await page.goto("/search?q=batman");

    const pagination = page.getByRole("navigation", { name: "Pagination" });
    await pagination.getByRole("link", { name: "Next →" }).click();

    await expect(page).toHaveURL("/search?q=batman&page=2");
    await expect(pagination.locator('[aria-current="page"]')).toHaveText("2");
  });

  test("a page number past the last page offers a way back", async ({ page }) => {
    await page.goto("/search?q=batman&page=499");

    await expect(page.getByText("No more results on this page.")).toBeVisible();
    await page.getByRole("link", { name: "Back to page 1" }).click();
    await expect(page).toHaveURL("/search?q=batman");
  });
});
