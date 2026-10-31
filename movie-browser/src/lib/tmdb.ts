import { API_BASE_URL, ENDPOINTS } from "@/utils/urls";
import type { MovieDetails, MovieList } from "@/types/movie";
import { notFound } from "next/navigation";

// tmdb helper
export async function tmdb<T>(path:string,revalidate=3600):Promise<T>{
    const res = await fetch(`${API_BASE_URL}${path}`,{
        headers:{
            Authorization:`Bearer ${process.env.TMDB_API_TOKEN}`
        },
        next:{revalidate}
    })
    if(res.status ===404) notFound() // shor not-found.tsx
    if(!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
}
// 
// Functions to add:

// getTrending()
export async function getTrending(timeWindow:"day"|"week"="week"){
    //  reuses tmdb() helper, which adds the token, caching and error handling
    const data = await tmdb<MovieList>(ENDPOINTS.trending(timeWindow));
    return data.results;
}
// getPopular(page)
// getMovie(id)
export async function getMovieById(id:string){
 return await tmdb<MovieDetails>(ENDPOINTS.movie(id),86400); //// details rarely change → 1 day
 
}
// searchMovies(q, page)
// getGenres()
// getByGenre(id, page)
// Poster URL: https://image.tmdb.org/t/p/w500${poster_path}