import { getTrending } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";
import GenreList from "@/components/GenreList";

export default async function Home() {
  const movies = await getTrending();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <GenreList />
      <h1 className="mb-6 mt-4 text-2xl font-bold">Trending this week</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}
