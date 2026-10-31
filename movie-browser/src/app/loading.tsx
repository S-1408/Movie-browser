// Skeleton shown while a page's data loads (home, search, genre).
// Same layout as the real grid, so nothing jumps when movies appear.
const Loading = () => {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8" aria-busy="true" aria-label="Loading">
      {/* genre chips */}
      <div className="flex gap-2 overflow-hidden pb-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-7.5 w-20 shrink-0 rounded-full bg-zinc-800" />
        ))}
      </div>

      {/* heading */}
      <div className="mb-6 mt-4 h-8 w-56 rounded bg-zinc-800" />

      {/* movie grid: same columns as MovieGrid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i}>
            <div className="aspect-2/3 rounded-lg bg-zinc-800" />
            <div className="mt-2 h-4 w-3/4 rounded bg-zinc-800" />
            <div className="mt-1 h-3 w-1/3 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </main>
  )
}

export default Loading
