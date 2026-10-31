"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string }; // throw error , can be use as error.message
  reset: () => void; // this help to try the render page again used by try again button
};

const isDev = process.env.NODE_ENV === "development";
console.log(process.env.NODE_ENV);

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  // log in browser console (server errors are already logged in Vercel logs)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      {/* real message only in dev, production shows a safe generic one */}
      <p>{isDev ? error.message : "We couldn't load this page. Please try again."}</p>
      {/* digest matches the error id in Vercel logs */}
      {error.digest && <p>Error ID: {error.digest}</p>}
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

export default ErrorPage
// Next.js requires error.tsx to be a Client Component.
// Debugging on Vercel: when a user sees Error ID: 123456789, search for that ID in the Vercel Logs and you'll find the full stack trace.