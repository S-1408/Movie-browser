import type { Metadata } from "next";
import Image from "next/image";
import { getMovieById } from "@/lib/tmdb"
import { IMAGE_SIZES, imageUrl, youtubeEmbedUrl } from "@/utils/media";
import MovieGrid from "@/components/MovieGrid";

// Browser tab title + SEO (fetch is deduped, so this doesn't call TMDB twice)
// It sets the page's <title> and <meta name="description"> for each movie-Without it, every movie page would use the title from layout.tsx, which is still the default "Create Next App". 
export async function generateMetadata({ params }: PageProps<"/movie/[id]">): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id); 
  return { //Google displays the title and the description from your page:
    title: movie.title || "Movie Browser", // Accessibility -Screen readers announce the page title when a page loads,o a blind user hears "Fight Club | Movie Browser" instead of "Create Next App".
    description: movie.overview, 
    openGraph: { //Link previews (WhatsApp, Slack, Twitter, LinkedIn)
    images: imageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop) ?? undefined,
  },
  };
}

const MoviePage = async ({ params }: PageProps<"/movie/[id]">) => {
  const { id } = await params;
  const movie = await getMovieById(id);

  const poster = imageUrl(movie.poster_path);
  const backdrop = imageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop);
  const year = movie.release_date?.slice(0, 4);
  // 135 -> "2h 15m"
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const genres = movie.genres.map((g) => g.name).join(", ");
  const trailer = movie.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const cast = movie.credits.cast.slice(0, 10); // top 10 cast
  const similar = movie.similar.results.slice(0, 12);

  return (
    <main>
      {/* Hero: dimmed backdrop with poster + info on top */}
      <section className="relative">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            preload
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row">
          <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:w-64">
            {poster ? (
              <Image
                src={poster}
                alt={movie.title}
                fill
                preload // "priority" is deprecated in Next 16
                sizes="(max-width: 640px) 192px, 256px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end gap-3">
            <h1 className="text-3xl font-bold sm:text-4xl">
              {movie.title} {year && <span className="font-normal text-zinc-400">({year})</span>}
            </h1>
            {movie.tagline && <p className="italic text-zinc-400">&ldquo;{movie.tagline}&rdquo;</p>}
            <p className="text-sm text-zinc-300">
              <span className="text-yellow-400">
                {movie.vote_count > 0 ? `★ ${movie.vote_average.toFixed(1)}` : "Not rated yet"}
              </span>
              {runtime && <> · {runtime}</>}
              {genres && <> · {genres}</>}
            </p>
            {movie.overview && <p className="max-w-3xl leading-relaxed">{movie.overview}</p>}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        {trailer && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Trailer</h2>
            <iframe
              src={youtubeEmbedUrl(trailer.key)}
              title={trailer.name}
              className="aspect-video w-full max-w-4xl rounded-lg"
              loading="lazy" // YouTube player is ~1MB; load it only when scrolled near
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </section>
        )}

        {cast.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {cast.map((actor) => {
                const photo = imageUrl(actor.profile_path, IMAGE_SIZES.profile);
                return (
                  <div key={actor.id} className="w-28 shrink-0">
                    <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-zinc-800">
                      {photo && (
                        <Image src={photo} alt={actor.name} fill sizes="112px" className="object-cover" />
                      )}
                    </div>
                    <p className="mt-2 truncate text-sm font-medium">{actor.name}</p>
                    <p className="truncate text-xs text-zinc-500">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Similar movies</h2>
            <MovieGrid movies={similar} />
          </section>
        )}
      </div>
    </main>
  )
}

export default MoviePage
