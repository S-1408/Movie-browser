// TMDB says total_pages can be 1001, but any page above 500 returns 400 Bad Request
export const MAX_PAGE = 500;

// ?page= from the URL -> safe page number between 1 and MAX_PAGE
// "abc" -> 1, "0" -> 1, "-3" -> 1, "2.5" -> 2, "9999" -> 500
export const parsePage = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Math.floor(Number(raw));
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(page, MAX_PAGE);
};

// Page numbers to show around the current page, with "..." gaps
// current 6 of 500 -> [1, "...", 5, 6, 7, "...", 500]
export const getPageNumbers = (current: number, total: number): (number | "...")[] => {
  const pages = new Set([1, current - 1, current, current + 1, total]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("...");
    result.push(page);
  });
  return result;
};
