// A fake TMDB API. Each handler says: "when a request for this URL comes in, answer with this".
// Your real code still calls fetch("https://api.themoviedb.org/..."), and MSW answers instead of TMDB.
import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/utils/urls";
import { makeMovie, makeMovieList } from "@/test/fixtures";

// Fake data the handlers return. Tests import these to compare results.
export const fakeTrending = [
  makeMovie({ id: 27205, title: "Inception" }),
  makeMovie({ id: 157336, title: "Interstellar" }),
];

export const fakeGenres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
];

export const fakeMovieDetails = {
  ...makeMovie({ id: 27205, title: "Inception" }),
  genres: [{ id: 28, name: "Action" }],
  runtime: 148,
  tagline: "Your mind is the scene of the crime.",
  credits: { cast: [] },
  videos: { results: [] },
  similar: makeMovieList([]),
};

// The real TMDB rejects requests without a token, so the fake one does too
const hasValidToken = (request: Request) =>
  request.headers.get("Authorization") === "Bearer test-token";

export const handlers = [
  // Runs before every route below: no token -> 401
  http.all(`${API_BASE_URL}/*`, ({ request }) => {
    if (!hasValidToken(request)) {
      return HttpResponse.json({ status_message: "Invalid API key" }, { status: 401 });
    }
    // returning nothing = "not handled here, try the next handler"
  }),

  // :timeWindow is a URL parameter, like [id] in Next.js routes
  http.get(`${API_BASE_URL}/trending/movie/:timeWindow`, () =>
    HttpResponse.json(makeMovieList(fakeTrending)),
  ),

  http.get(`${API_BASE_URL}/movie/:id`, ({ params }) => {
    if (params.id !== "27205") {
      return HttpResponse.json({ status_message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(fakeMovieDetails);
  }),

  // Reads ?query= and ?page= from the URL, like the real API
  http.get(`${API_BASE_URL}/search/movie`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") ?? "";
    const page = Number(url.searchParams.get("page"));

    const results = query === "nothing" ? [] : [makeMovie({ title: `${query} result` })];
    return HttpResponse.json(makeMovieList(results, { page, total_pages: results.length ? 5 : 0 }));
  }),

  http.get(`${API_BASE_URL}/genre/movie/list`, () => HttpResponse.json({ genres: fakeGenres })),

  http.get(`${API_BASE_URL}/discover/movie`, ({ request }) => {
    const url = new URL(request.url);
    const genreId = url.searchParams.get("with_genres");
    const page = Number(url.searchParams.get("page"));
    return HttpResponse.json(makeMovieList([makeMovie({ title: `Genre ${genreId} movie` })], { page }));
  }),
];
