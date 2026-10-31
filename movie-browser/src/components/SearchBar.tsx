"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Reads ?q= from the URL so the input shows the current search
const SearchBar = () => {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  // key: when the URL query changes (back button, clicking logo), React
  // throws away the old form and creates a new one with fresh state
  return <SearchForm key={urlQuery} initialQuery={urlQuery} />;
  //// Use key to reset state, not useEffect
{/* <SearchForm key={urlQuery} initialQuery={urlQuery} />  // ✅ */}
// When key changes, React throws away the old component and creates a new one with fresh state. That's why SearchBar is split into two parts: the outer part reads the URL, and the inner part owns the state. This pattern is worth remembering; you'll use it often
}

const SearchForm = ({ initialQuery }: { initialQuery: string }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser's full page reload
    const q = query.trim();
    if (!q) return;
    // encodeURIComponent: "fast & furious" -> "fast%20%26%20furious"
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        aria-label="Search movies"
        className="w-full rounded-lg border border-zinc-700 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-zinc-400"
      />
    </form>
  )
}

export default SearchBar


// 1. The URL holds the search, not React state

// SearchBar (browser)            search/page.tsx (server)
//   types "batman"
//   router.push("/search?q=batman") ──▶ reads searchParams.q
//                                        fetches TMDB
//                                        renders MovieGrid

//  Keep "use client" as small as possible
// Only the input needs the browser, because it handles typing and submitting. The page that fetches and displays results stays on the server.
// . Controlled input
// React state is the single source of truth: the input always shows query, and every keystroke updates it. That's why you can read query in handleSubmit.
// Use a <form>, not a button with onClick -<form onSubmit={handleSubmit}>
// Enter submits automatically, so you don't need a key handler.
// e.preventDefault() stops the browser's default full-page reload, and router.push does a fast client-side navigation instead.
// role="search", type="search" and aria-label let screen readers announce it, and mobile keyboards show a 🔍 key.

// encodeURIComponent: URLs have special characters
// "fast & furious"  without encoding →  /search?q=fast & furious
//                                        q = "fast "   and a broken param " furious"
//                   with encoding    →  /search?q=fast%20%26%20furious   ✅
// so without encoding the search would break. ?, # and = cause the same problem.

