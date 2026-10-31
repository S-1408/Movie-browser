import type { Metadata } from "next";
import Link from "next/link";
import { searchMovies } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { parsePage } from "@/utils/pagination";

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
  const page = parsePage(params.page); // ?page=0 or 501 would make TMDB return 400

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
        <>
          <MovieGrid movies={data.results} />
          <Pagination currentPage={page} totalPages={data.total_pages} basePath="/search" query={{ q }} />
        </>
      ) : page > data.total_pages && data.total_pages > 0 ? (
        // e.g. ?page=50 when there are only 2 pages: results exist, just not here
        <p className="text-zinc-400">
          No more results on this page.{" "}
          <Link href={`/search?q=${encodeURIComponent(q)}`} className="text-yellow-400 hover:underline">
            Back to page 1
          </Link>
        </p>
      ) : (
        <p className="text-zinc-400">No movies found. Try a different title.</p>
      )}
    </main>
  )
}

export default SearchPage
