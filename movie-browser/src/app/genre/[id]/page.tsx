import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getByGenre, getGenres } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";
import GenreList from "@/components/GenreList";
import Pagination from "@/components/Pagination";
import { parsePage } from "@/utils/pagination";

// TMDB has no "get one genre" endpoint, so find it in the (cached) list.
// Unknown id like /genre/abc or /genre/999 -> not-found page
async function findGenre(id: string) {
  const genres = await getGenres();
  const genre = genres.find((g) => g.id === Number(id));
  if (!genre) notFound();
  return genre;
}

export async function generateMetadata({ params }: PageProps<"/genre/[id]">): Promise<Metadata> {
  const { id } = await params;
  const genre = await findGenre(id);
  return { title: `${genre.name} movies` };
}

const GenrePage = async ({ params, searchParams }: PageProps<"/genre/[id]">) => {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = parsePage(page); // ?page=0 or 501 would make TMDB return 400

  const genre = await findGenre(id);
  const data = await getByGenre(id, currentPage);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <GenreList activeId={genre.id} />
      <h1 className="mb-6 mt-4 text-2xl font-bold">{genre.name} movies</h1>
      <MovieGrid movies={data.results} />
      <Pagination currentPage={currentPage} totalPages={data.total_pages} basePath={`/genre/${genre.id}`} />
    </main>
  )
}

export default GenrePage
