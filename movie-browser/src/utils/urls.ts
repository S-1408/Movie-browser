// Base URLs
export const API_BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed";

// API endpoints (paths are appended to API_BASE_URL)
export const ENDPOINTS = {
    // Home page lists
    trending: (timeWindow: "day" | "week" = "week") => `/trending/movie/${timeWindow}`,
    popular: (page = 1) => `/movie/popular?page=${page}`,
    topRated: (page = 1) => `/movie/top_rated?page=${page}`,
    nowPlaying: (page = 1) => `/movie/now_playing?page=${page}`,
    upcoming: (page = 1) => `/movie/upcoming?page=${page}`,

    // Movie detail (credits, videos and similar in one request)
    movie: (id: number | string) =>
        `/movie/${id}?append_to_response=credits,videos,similar`,

    // Search
    search: (query: string, page = 1) =>
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,

    // Genres
    genres: () => `/genre/movie/list`,
    byGenre: (genreId: number | string, page = 1) =>
        `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,

    // Optional extras
    credits: (id: number | string) => `/movie/${id}/credits`,
    videos: (id: number | string) => `/movie/${id}/videos`,
    similar: (id: number | string) => `/movie/${id}/similar`,
    recommendations: (id: number | string) => `/movie/${id}/recommendations`,
    person: (personId: number | string) => `/person/${personId}`,
    personMovies: (personId: number | string) => `/person/${personId}/movie_credits`,
};
