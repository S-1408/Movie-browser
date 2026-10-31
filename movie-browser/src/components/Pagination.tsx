import Link from "next/link";
import { getPageNumbers, MAX_PAGE } from "@/utils/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;                  // "/search" or "/genre/28"
  query?: Record<string, string>;    // other params to keep, e.g. { q: "batman" }
};

// Server Component: plain <Link>s, no state or clicks needed
const Pagination = ({ currentPage, totalPages, basePath, query = {} }: PaginationProps) => {
  const lastPage = Math.min(totalPages, MAX_PAGE);
  if (lastPage <= 1) return null;

  // Keep existing params (like q) and only change page. Page 1 has no ?page= (clean URL)
  const pageHref = (page: number) => {
    const params = new URLSearchParams(query);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const base = "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm";
  const idle = `${base} border-zinc-700 hover:border-zinc-400`;
  const disabled = `${base} border-zinc-800 text-zinc-600`;

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} className={idle}>← Prev</Link>
      ) : (
        <span className={disabled} aria-disabled="true">← Prev</span>
      )}

      {getPageNumbers(currentPage, lastPage).map((page, i) =>
        page === "..." ? (
          <span key={`gap-${i}`} className="px-1 text-zinc-500">…</span>
        ) : page === currentPage ? (
          <span key={page} aria-current="page" className={`${base} border-yellow-400 bg-yellow-400 font-semibold text-black`}>
            {page}
          </span>
        ) : (
          <Link key={page} href={pageHref(page)} className={idle}>{page}</Link>
        )
      )}

      {currentPage < lastPage ? (
        <Link href={pageHref(currentPage + 1)} className={idle}>Next →</Link>
      ) : (
        <span className={disabled} aria-disabled="true">Next →</span>
      )}
    </nav>
  )
}

export default Pagination
