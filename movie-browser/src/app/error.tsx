"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string }; // throw error , can be use as error.message
  reset: () => void; // this help to try the render page again used by try again button
};

const isDev = process.env.NODE_ENV === "development";

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  // log in browser console (server errors are already logged in Vercel logs)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="text-6xl" aria-hidden="true">🎬</p>
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      {/* real message only in dev, production shows a safe generic one */}
      <p className="max-w-md text-zinc-400">{isDev ? error.message : "We couldn't load this page. Please try again."}</p>
      {/* digest matches the error id in Vercel logs */}
      {error.digest && <p className="font-mono text-xs text-zinc-500">Error ID: {error.digest}</p>}
      <button
        onClick={() => reset()}
        className="mt-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300"
      >
        Try again
      </button>
    </main>
  )
}

export default ErrorPage
// Next.js requires error.tsx to be a Client Component.
// Debugging on Vercel: when a user sees Error ID: 123456789, search for that ID in the Vercel Logs and you'll find the full stack trace.