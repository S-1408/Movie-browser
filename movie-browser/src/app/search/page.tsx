import type { Metadata } from "next";
import { searchMovies } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";

// ?q=a&q=b gives an array, so always take a single string so TypeScript forces you to handle three cases: string, array or missing. Number(...) || 1 turns ?page=abc into page 1 instead of NaN.
const getQuery = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const q = getQuery((await searchParams).q);
  return { title: q ? `Search: ${q}` : "Search" };
}

const SearchPage = async ({ searchParams }: PageProps<"/search">) => {
  // The server page: searchParams is a Promise and can be an array -/search?q=a&q=b gives q = ["a", "b"]
  const params = await searchParams;
  const q = getQuery(params.q);
  const page = Number(getQuery(params.page)) || 1;

  if (!q) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <p className="text-zinc-400">Type a movie name in the search bar to get started.</p>
      </main>
    )
  }

  const data = await searchMovies(q, page);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Results for &ldquo;{q}&rdquo;
        <span className="ml-2 text-base font-normal text-zinc-400">({data.total_results})</span>
      </h1>

      {data.results.length > 0 ? (
        <MovieGrid movies={data.results} />
      ) : (
        <p className="text-zinc-400">No movies found. Try a different title.</p>
      )}
    </main>
  )
}

export default SearchPage
