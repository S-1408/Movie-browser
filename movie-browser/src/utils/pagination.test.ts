import { describe, expect, it } from "vitest";
import { getPageNumbers, MAX_PAGE, parsePage } from "@/utils/pagination";

describe("parsePage", () => {
  // Valid input
  it("returns the number for a valid page", () => {
    expect(parsePage("1")).toBe(1);
    expect(parsePage("7")).toBe(7);
  });

  it("rounds decimals down", () => {
    expect(parsePage("2.5")).toBe(2);
    expect(parsePage("2.99")).toBe(2);
  });

  // Missing or junk input -> page 1
  it("returns 1 when ?page= is missing or empty", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
  });

  it("returns 1 for text that isn't a number", () => {
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("NaN")).toBe(1);
    expect(parsePage("Infinity")).toBe(1);
  });

  it("returns 1 for zero and negative numbers", () => {
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("0.5")).toBe(1); // floors to 0
  });

  // Upper limit (TMDB returns 400 above page 500)
  it("caps the page at MAX_PAGE", () => {
    expect(parsePage(String(MAX_PAGE))).toBe(500);
    expect(parsePage("501")).toBe(500);
    expect(parsePage("9999")).toBe(500);
  });

  // ?page=3&page=8 gives an array
  it("uses the first value when the param is an array", () => {
    expect(parsePage(["3", "8"])).toBe(3);
    expect(parsePage(["abc", "8"])).toBe(1);
    expect(parsePage([])).toBe(1);
  });
});

describe("getPageNumbers", () => {
  // Few pages: no gaps
  it("returns [1] when there is only one page", () => {
    expect(getPageNumbers(1, 1)).toEqual([1]);
  });

  it("shows every page when there are no gaps", () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(2, 3)).toEqual([1, 2, 3]);
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  // Many pages: "..." gaps
  it("shows gaps on both sides when the current page is in the middle", () => {
    expect(getPageNumbers(6, 500)).toEqual([1, "...", 5, 6, 7, "...", 500]);
  });

  it("shows only a right gap near the start", () => {
    expect(getPageNumbers(1, 500)).toEqual([1, 2, "...", 500]);
    expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, "...", 10]);
  });

  it("shows only a left gap near the end", () => {
    expect(getPageNumbers(500, 500)).toEqual([1, "...", 499, 500]);
    expect(getPageNumbers(8, 10)).toEqual([1, "...", 7, 8, 9, 10]);
  });

  // Rules that must hold for any input
  it("never repeats a page and keeps pages in order", () => {
    for (let total = 1; total <= 20; total++) {
      for (let current = 1; current <= total; current++) {
        const numbers = getPageNumbers(current, total).filter((p) => p !== "...");
        expect(numbers).toEqual([...new Set(numbers)].sort((a, b) => a - b));
      }
    }
  });

  it("always includes the first, current and last page", () => {
    const pages = getPageNumbers(42, 100);
    expect(pages).toContain(1);
    expect(pages).toContain(42);
    expect(pages).toContain(100);
  });
});
