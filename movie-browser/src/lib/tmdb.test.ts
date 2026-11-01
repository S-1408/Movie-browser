// @vitest-environment node
// tmdb.ts is server code, so run it in plain Node instead of the fake browser (jsdom)

import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { http, HttpResponse } from "msw";
import { notFound } from "next/navigation";
import { getByGenre, getGenres, getMovieById, getTrending, searchMovies, tmdb } from "@/lib/tmdb";
import { server } from "@/test/msw/server";
import { fakeGenres, fakeMovieDetails, fakeTrending } from "@/test/msw/handlers";
import { API_BASE_URL } from "@/utils/urls";

// The real notFound() throws a special Next.js error that only the framework understands.
// Our fake one throws too, so code after it stops running, just like the real one.
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// fetch is NOT replaced: requests really go out, and MSW (started in vitest.setup.ts) answers them.
// The spy only watches the calls, so we can check the Next.js cache option ({ next: { revalidate } }),
// which is a fetch() option and never becomes part of the HTTP request MSW sees.
// Created in beforeEach, not at the top: server.listen() swaps globalThis.fetch for MSW's
// version, so the spy must wrap fetch *after* that, or it watches a fetch nobody calls.
let fetchSpy: MockInstance<typeof fetch>;
const lastRevalidate = () => (fetchSpy.mock.calls.at(-1)![1] as { next: { revalidate: number } }).next.revalidate;

beforeEach(() => {
  vi.stubEnv("TMDB_API_TOKEN", "test-token");
  fetchSpy = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("tmdb()", () => {
  it("throws a clear error when the token is missing", async () => {
    vi.stubEnv("TMDB_API_TOKEN", "");
    await expect(tmdb("/genre/movie/list")).rejects.toThrow("TMDB_API_TOKEN is not set");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends the token, so the fake TMDB accepts the request", async () => {
    // The fake TMDB returns 401 without "Bearer test-token" (see handlers.ts),
    // so getting data back proves the header was sent
    await expect(tmdb("/genre/movie/list")).resolves.toEqual({ genres: fakeGenres });
  });

  it("throws on 401 when the token is wrong", async () => {
    vi.stubEnv("TMDB_API_TOKEN", "wrong-token");
    await expect(tmdb("/genre/movie/list")).rejects.toThrow("TMDB 401");
  });

  it("calls notFound() on a 404", async () => {
    await expect(tmdb("/movie/999999")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  // server.use() adds a handler for this one test only (reset in vitest.setup.ts)
  it("throws with the status code when TMDB is down", async () => {
    server.use(http.get(`${API_BASE_URL}/genre/movie/list`, () => new HttpResponse(null, { status: 500 })));

    await expect(tmdb("/genre/movie/list")).rejects.toThrow("TMDB 500");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("throws when the network fails", async () => {
    server.use(http.get(`${API_BASE_URL}/genre/movie/list`, () => HttpResponse.error()));
    await expect(tmdb("/genre/movie/list")).rejects.toThrow();
  });

  it("caches for 1 hour by default, or for a custom time", async () => {
    await tmdb("/genre/movie/list");
    expect(lastRevalidate()).toBe(3600);

    await tmdb("/genre/movie/list", 60);
    expect(lastRevalidate()).toBe(60);
  });
});

describe("getTrending", () => {
  it("returns only the results array", async () => {
    await expect(getTrending()).resolves.toEqual(fakeTrending);
  });

  it("asks for weekly trending by default, or daily", async () => {
    // Record which URLs were requested, then let the normal handler answer
    const requested: string[] = [];
    server.events.on("request:start", ({ request }) => requested.push(new URL(request.url).pathname));

    await getTrending();
    await getTrending("day");

    expect(requested).toEqual(["/3/trending/movie/week", "/3/trending/movie/day"]);
    server.events.removeAllListeners();
  });
});

describe("getMovieById", () => {
  it("returns the movie details, cached for 1 day", async () => {
    await expect(getMovieById("27205")).resolves.toEqual(fakeMovieDetails);
    expect(lastRevalidate()).toBe(86400);
  });

  it("asks for credits, videos and similar in the same request", async () => {
    let appendToResponse: string | null = null;
    server.use(
      http.get(`${API_BASE_URL}/movie/:id`, ({ request }) => {
        appendToResponse = new URL(request.url).searchParams.get("append_to_response");
        return HttpResponse.json(fakeMovieDetails);
      }),
    );

    await getMovieById("27205");
    expect(appendToResponse).toBe("credits,videos,similar");
  });

  it("calls notFound() when TMDB has no such movie", async () => {
    await expect(getMovieById("999999")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it.each(["abc", "12abc", "-5", "1.5", "", "../etc"])(
    "calls notFound() for invalid id %j without calling the API",
    async (id) => {
      await expect(getMovieById(id)).rejects.toThrow("NEXT_NOT_FOUND");
      expect(fetchSpy).not.toHaveBeenCalled();
    },
  );
});

describe("searchMovies", () => {
  it("sends the query and page, and returns the whole list", async () => {
    // The fake TMDB puts the query in the title and echoes the page back
    const data = await searchMovies("batman", 3);
    expect(data.results[0].title).toBe("batman result");
    expect(data.page).toBe(3);
    expect(data.total_pages).toBe(5);
  });

  it("encodes special characters so TMDB gets the full query", async () => {
    // Without encodeURIComponent, TMDB would only see "fast " (the & starts a new param)
    const data = await searchMovies("fast & furious");
    expect(data.results[0].title).toBe("fast & furious result");
  });

  it("defaults to page 1", async () => {
    await expect(searchMovies("batman")).resolves.toMatchObject({ page: 1 });
  });

  it("returns an empty list when nothing matches", async () => {
    await expect(searchMovies("nothing")).resolves.toMatchObject({ results: [], total_pages: 0 });
  });

  it("is never cached", async () => {
    await searchMovies("batman");
    expect(lastRevalidate()).toBe(0);
  });
});

describe("getGenres", () => {
  it("returns only the genres array, cached for 1 day", async () => {
    await expect(getGenres()).resolves.toEqual(fakeGenres);
    expect(lastRevalidate()).toBe(86400);
  });
});

describe("getByGenre", () => {
  it("asks for the genre and page, sorted by popularity", async () => {
    let sortBy: string | null = null;
    server.events.on("request:start", ({ request }) => {
      sortBy = new URL(request.url).searchParams.get("sort_by");
    });

    const data = await getByGenre("28", 2);
    expect(data.results[0].title).toBe("Genre 28 movie");
    expect(data.page).toBe(2);
    expect(sortBy).toBe("popularity.desc");
    server.events.removeAllListeners();
  });
});
