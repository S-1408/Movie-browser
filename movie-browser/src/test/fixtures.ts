import type { Movie, MovieList } from "@/types/movie";

// Fake TMDB data for tests. Override only the fields a test cares about:
// makeMovie({ poster_path: null })
export const makeMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: "Inception",
  overview: "A thief who steals secrets through dreams.",
  poster_path: "/inception.jpg",
  backdrop_path: "/inception-bg.jpg",
  release_date: "2010-07-16",
  vote_average: 8.4,
  vote_count: 35000,
  genre_ids: [28, 878],
  ...overrides,
});

export const makeMovieList = (results: Movie[] = [makeMovie()], overrides: Partial<MovieList> = {}): MovieList => ({
  page: 1,
  results,
  total_pages: 1,
  total_results: results.length,
  ...overrides,
});
