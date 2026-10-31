// A movie item as returned in TMDB lists (trending, popular, search...)
export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
};

// Paginated list response
export type MovieList = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type Genre = {
  id: number;
  name: string;
};
export type Cast = {
  id: number;
  name:string;
 character:string
 profile_path: string |null;
};
export type Video = {
    id: string;
    key: string;          // YouTube video id
    site: string;         // "YouTube"
    type: string;         // "Trailer", "Teaser"...
    name: string;
};
// Detail response: list fields + extra fields + append_to_response data
export type MovieDetails = Omit<Movie, "genre_ids"> & {
    genres: Genre[];
    runtime: number | null;
    tagline: string;
    credits: { cast: Cast[] };
    videos: { results: Video[] };
    similar: MovieList;
};