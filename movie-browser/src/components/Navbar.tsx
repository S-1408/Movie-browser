import { Suspense } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
// Why the Navbar is a Server Component
// It has no clicks or state, only links, and <Link> works in Server Components. Only SearchBar will need "use client", because it handles typing.
const Navbar = () => {
  return (
    // sticky: stays on top while scrolling, blur shows content faintly behind it
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-bold">
          🎬 <span className="hidden sm:inline">Movie Browser</span>
        </Link>

        <Link href="/" className="text-sm text-zinc-400 hover:text-foreground">
          Home
        </Link>

        {/* SearchBar is a Client Component; Navbar itself stays a Server Component.
            Suspense: SearchBar reads the URL (useSearchParams), which is only known at
            request time, so the rest of the page can still be prerendered */}
            {/* useSearchParams() needs <Suspense> */}
        <div className="ml-auto w-full max-w-xs">
          <Suspense fallback={<div className="h-8.5 rounded-lg border border-zinc-700" />}>
            <SearchBar />
          </Suspense>
        </div>
      </nav>
    </header>
  )
}

export default Navbar

// 7. useSearchParams() needs <Suspense>
// The first build failed with this error:


// Error: Route "/_not-found": Next.js encountered URL data `useSearchParams()`
// in a Client Component outside of `<Suspense>`.
// Why: Next.js prerenders pages as HTML at build time, and at build time there's no URL query, because no user has visited yet. The Navbar is on every page, so useSearchParams() blocked prerendering for the whole site.

// The fix:
// <Suspense fallback={<div className="h-8.5 rounded-lg border ..." />}>
//   <SearchBar />
// </Suspense>

// Next.js prerenders everything except SearchBar and shows the empty box in its place. When the request arrives, the real input streams in. The fallback is the same size, so nothing jumps.

// Rule: any component that reads request-time data (useSearchParams, cookies, headers) needs a Suspense boundary around it.