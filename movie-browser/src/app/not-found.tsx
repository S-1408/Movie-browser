import Link from "next/link";

// Shown for unknown URLs and whenever notFound() is called
// (bad movie id, bad genre id). Title comes from layout's default: "Movie Browser"
const NotFoundPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="text-6xl" aria-hidden="true">🎞️</p>
      <h1 className="text-3xl font-bold">404 – Scene missing</h1>
      <p className="max-w-md text-zinc-400">
        We couldn&apos;t find the movie or page you were looking for. It may have been removed, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300"
      >
        Back to home
      </Link>
    </main>
  )
}

export default NotFoundPage
