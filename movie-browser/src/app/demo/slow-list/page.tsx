"use client";

// Learning demo: why big lists get slow. Delete this folder before deploying.
import { memo, Profiler, useDeferredValue, useMemo, useRef, useState } from "react";

type FakeMovie = { id: number; title: string; year: number; rating: number };

const makeMovies = (count: number): FakeMovie[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Movie ${i} ${["Dark", "Lost", "Star", "Night", "Fire"][i % 5]}`,
    year: 1980 + (i % 45),
    rating: (i % 100) / 10,
  }));

// Plain card: re-renders every time the parent re-renders
const Card = ({ movie }: { movie: FakeMovie }) => (
  <div className="rounded border border-zinc-700 p-2 text-xs">
    <div className="mb-1 aspect-[2/3] rounded bg-zinc-800" />
    <p className="truncate font-medium">{movie.title}</p>
    <p className="text-zinc-500">{movie.year} · ★ {movie.rating.toFixed(1)}</p>
  </div>
);

// Memo card: skips re-render if `movie` is the same object as last time
const MemoCard = memo(Card);

const List = ({ movies, optimized }: { movies: FakeMovie[]; optimized: boolean }) => {
  const CardComponent = optimized ? MemoCard : Card;
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
      {movies.map((movie) => (
        <CardComponent key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

// Memo list: when only `query` changes but deferred value hasn't caught up, skip
const MemoList = memo(List);

export default function SlowListDemo() {
  const [count, setCount] = useState(5000);
  const [movies, setMovies] = useState(() => makeMovies(5000));
  const [query, setQuery] = useState("");
  const [optimized, setOptimized] = useState(false);
  const timeRef = useRef<HTMLSpanElement>(null);

  // Optimized mode: input updates instantly, list catches up in the background
  const deferredQuery = useDeferredValue(query);
  const activeQuery = optimized ? deferredQuery : query;

  // useMemo keeps the same array reference until movies/query change,
  // otherwise memo(List) would always see a "new" prop and re-render
  const filtered = useMemo(
    () => movies.filter((m) => m.title.toLowerCase().includes(activeQuery.toLowerCase())),
    [movies, activeQuery]
  );

  const ListComponent = optimized ? MemoList : List;

  return (
    <main className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-xl font-bold">Slow list demo</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <label>
          Items:{" "}
          <select
            className="rounded border bg-transparent p-1"
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value);
              setCount(n);
              setMovies(makeMovies(n));
            }}
          >
            {[100, 1000, 5000, 10000].map((n) => (
              <option key={n} value={n} className="text-black">{n}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <input type="checkbox" checked={optimized} onChange={(e) => setOptimized(e.target.checked)} />
          Optimized (memo + useDeferredValue)
        </label>

        <span>
          Last list render: <span ref={timeRef} className="font-mono text-yellow-400">-</span> ms
        </span>
      </div>

      <input
        className="mb-4 w-full rounded border bg-transparent p-2"
        placeholder="Type fast here, e.g. 'dark star'..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p className="mb-2 text-sm text-zinc-500">{filtered.length} results</p>

      {/* Profiler measures how long React took to render the list */}
      <Profiler
        id="list"
        onRender={(_id, _phase, actualDuration) => {
          if (timeRef.current) timeRef.current.textContent = actualDuration.toFixed(1);
        }}
      >
        <ListComponent movies={filtered} optimized={optimized} />
      </Profiler>
    </main>
  );
}
