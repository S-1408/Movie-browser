// Adds DOM matchers like toBeInTheDocument(), toHaveAttribute()
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/test/msw/server";

// MSW: start the fake TMDB before all tests, stop it after.
// onUnhandledFrame: "error" -> a request with no handler fails the test,
// so a test can never call the real TMDB by accident.
// (MSW 2 called this option onUnhandledRequest; most tutorials still use that name.)
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  cleanup(); // remove rendered components so they don't leak into the next test
  server.resetHandlers(); // undo any server.use() overrides a test added
});

afterAll(() => server.close());
