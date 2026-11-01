import { expect, test } from "@playwright/test";

test.describe("Movie details", () => {
  test("clicking a movie card opens its details page", async ({ page }) => {
    await page.goto("/");

    // Remember the first card's title, then click it
    const firstCard = page.locator('main a[href^="/movie/"]').first();
    const title = await firstCard.getByRole("heading").textContent();
    await firstCard.click();

    // We're on /movie/<number>, and the big heading shows the same movie
    await expect(page).toHaveURL(/\/movie\/\d+$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title!);
  });

  // A well-known movie, so the details are stable enough to check
  test("shows details, cast and similar movies", async ({ page }) => {
    await page.goto("/movie/27205"); // Inception

    await expect(page).toHaveTitle("Inception | Movie Browser");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Inception");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("(2010)");
    // Only look inside the hero section: "Similar movies" cards also show "★ 7.0"
    const hero = page.locator("section").first();
    await expect(hero.getByText(/★ \d\.\d/)).toBeVisible();
    await expect(hero.getByText(/2h 28m/)).toBeVisible();

    await expect(page.getByRole("heading", { name: "Cast" })).toBeVisible();
    await expect(page.getByText("Leonardo DiCaprio")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Similar movies" })).toBeVisible();
  });

  test("shows the trailer", async ({ page }) => {
    await page.goto("/movie/27205");
    await expect(page.getByRole("heading", { name: "Trailer" })).toBeVisible();
    await expect(page.locator('iframe[src^="https://www.youtube.com/embed/"]')).toBeAttached();
  });
});

test.describe("Not found", () => {
  // A normal for loop creates one test per URL
  for (const url of ["/movie/abc", "/movie/999999999", "/genre/999", "/some-page-that-does-not-exist"]) {
    test(`${url} shows the 404 page`, async ({ page }) => {
      await page.goto(url);
      await expect(page.getByRole("heading", { name: "404 – Scene missing" })).toBeVisible();
    });
  }

  test('"Back to home" on the 404 page works', async ({ page }) => {
    await page.goto("/movie/abc");
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL("/");
  });
});
