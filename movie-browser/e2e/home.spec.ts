// Start here: the simplest E2E test file, with every step explained.
import { expect, test } from "@playwright/test";

// test("name", async ({ page }) => { ... })
// `page` is a real browser tab that Playwright controls for you.
test("home page shows trending movies", async ({ page }) => {
  // 1. Open the page (baseURL from playwright.config.ts is added in front)
  await page.goto("/");

  // 2. Check the browser tab title
  await expect(page).toHaveTitle("Movie Browser");

  // 3. Find the heading the way a user sees it: by role + visible text
  await expect(page.getByRole("heading", { name: "Trending this week" })).toBeVisible();

  // 4. The grid should have movie cards. Each card is a link to /movie/<id>
  const movieCards = page.locator('main a[href^="/movie/"]');
  await expect(movieCards.first()).toBeVisible();
  expect(await movieCards.count()).toBeGreaterThan(5);
});

test("home page shows the genre list", async ({ page }) => {
  await page.goto("/");

  // <nav aria-label="Genres"> -> role "navigation" with name "Genres"
  const genres = page.getByRole("navigation", { name: "Genres" });
  await expect(genres.getByRole("link", { name: "Action" })).toBeVisible();
  await expect(genres.getByRole("link", { name: "Comedy" })).toBeVisible();
});

test("logo goes back to the home page", async ({ page }) => {
  await page.goto("/search?q=batman");

  // Click like a real user would
  await page.getByRole("link", { name: /Movie Browser/ }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Trending this week" })).toBeVisible();
});
