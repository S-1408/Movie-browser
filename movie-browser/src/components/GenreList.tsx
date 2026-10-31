import Link from "next/link";
import { getGenres } from "@/lib/tmdb";

// Async Server Component: fetches its own data, so any page can just drop it in
const GenreList = async ({ activeId }: { activeId?: number }) => {
  const genres = await getGenres();

  return (
    <nav aria-label="Genres" className="flex gap-2 overflow-x-auto pb-2">
      {genres.map((genre) => {
        const isActive = genre.id === activeId;
        return (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}`}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-full border px-3 py-1 text-sm transition-colors ${
              isActive
                ? "border-yellow-400 bg-yellow-400 text-black"
                : "border-zinc-700 text-zinc-300 hover:border-zinc-400"
            }`}
          >
            {genre.name}
          </Link>
        );
      })}
    </nav>
  )
}

export default GenreList
