import { getTrending } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";

export default async function Home() {
  const movies = await getTrending();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Trending this week</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}
