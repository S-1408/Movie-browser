// Skeleton shown while the movie details are loading
const MovieLoading = () => {
  return (
    <main className="mx-auto flex max-w-7xl animate-pulse flex-col gap-6 px-4 py-10 sm:flex-row">
      <div className="aspect-2/3 w-48 shrink-0 rounded-lg bg-zinc-800 sm:w-64" />
      <div className="flex flex-1 flex-col justify-end gap-3">
        <div className="h-9 w-2/3 rounded bg-zinc-800" />
        <div className="h-4 w-1/3 rounded bg-zinc-800" />
        <div className="h-4 w-1/2 rounded bg-zinc-800" />
        <div className="h-20 w-full max-w-3xl rounded bg-zinc-800" />
      </div>
    </main>
  )
}

export default MovieLoading
