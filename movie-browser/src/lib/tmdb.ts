import { API_BASE_URL } from "@/utils/urls";

async function tmdb<T>(path:string,revalidate=3600):Promise<T>{
    const res = await fetch(`${API_BASE_URL}${path}`,{
        headers:{
            Authorization:`Bearer ${process.env.TMDB_API_TOKEN}`
        },
        next:{revalidate}
    })
    if(!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
}
// 
// Functions to add:

// getTrending()
// getPopular(page)
// getMovie(id)
// searchMovies(q, page)
// getGenres()
// getByGenre(id, page)
// Poster URL: https://image.tmdb.org/t/p/w500${poster_path}