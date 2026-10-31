import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import { imageUrl } from "@/utils/media";

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const poster = imageUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);
console.log(movie)
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg ">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform group-hover:scale-105 duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
        <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-yellow-400">
          ★ {movie.vote_average.toFixed(1)}
        </span>
      </div>
      <h3 className="mt-2 truncate text-sm font-medium">{movie.title}</h3>
      {year && <p className="text-xs text-zinc-500">{year}</p>}
    </Link>
  )
}
