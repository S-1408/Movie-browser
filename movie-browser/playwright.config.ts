import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const isCI = !!process.env.CI; // GitHub Actions sets CI=true

export default defineConfig({
  testDir: "./e2e",           // where the E2E tests live
  fullyParallel: true,        // run tests at the same time (faster)
  workers: 2,                 // ...but only 2 at once, so we don't flood TMDB with requests
  forbidOnly: isCI,           // fail CI if someone left a test.only() in the code
  retries: 1,                 // tests call the real TMDB API, so retry once on a network hiccup
  reporter: isCI ? "github" : "list",

  use: {
    baseURL: `http://localhost:${PORT}`, // page.goto("/") -> http://localhost:3000/
    trace: "on-first-retry",             // record a step-by-step replay when a test fails
    screenshot: "only-on-failure",
  },

  // Which browsers to test in. Add firefox / webkit here later if you want.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Playwright starts the app for you before the tests and stops it afterwards.
  // Locally: dev server (fast to start). CI: the production build made in the Build step.
  webServer: {
    command: isCI ? "npm run start" : "npm run dev",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI, // if you already have `npm run dev` running, use it
    timeout: 120_000,
  },
});
