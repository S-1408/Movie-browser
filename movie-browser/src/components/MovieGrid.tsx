import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/MovieCard";

const MovieGrid = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {
        movies.map(movie=>(
          <MovieCard key={movie.id} movie={movie}/>
        ))
      }
    </div>
  )
}

export default MovieGrid
