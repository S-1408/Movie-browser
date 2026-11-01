import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Pagination from "@/components/Pagination";

// Pagination is a plain Server Component (no async, no hooks),
// so it renders in tests like any normal component

describe("Pagination", () => {
  // When to hide
  it("renders nothing when there is only one page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} basePath="/search" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when there are no results", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={0} basePath="/search" />);
    expect(container).toBeEmptyDOMElement();
  });

  // Prev / Next
  it("disables Prev on the first page", () => {
    render(<Pagination currentPage={1} totalPages={10} basePath="/genre/28" />);
    expect(screen.getByText("← Prev")).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("link", { name: "← Prev" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next →" })).toHaveAttribute("href", "/genre/28?page=2");
  });

  it("disables Next on the last page", () => {
    render(<Pagination currentPage={10} totalPages={10} basePath="/genre/28" />);
    expect(screen.getByText("Next →")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("link", { name: "← Prev" })).toHaveAttribute("href", "/genre/28?page=9");
  });

  it("links Prev and Next to the pages around the current one", () => {
    render(<Pagination currentPage={5} totalPages={10} basePath="/genre/28" />);
    expect(screen.getByRole("link", { name: "← Prev" })).toHaveAttribute("href", "/genre/28?page=4");
    expect(screen.getByRole("link", { name: "Next →" })).toHaveAttribute("href", "/genre/28?page=6");
  });

  // Current page
  it("marks the current page and doesn't make it a link", () => {
    render(<Pagination currentPage={3} totalPages={10} basePath="/genre/28" />);
    const current = screen.getByText("3");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "3" })).not.toBeInTheDocument();
  });

  // URLs
  it("links page 1 without ?page= (clean URL)", () => {
    render(<Pagination currentPage={2} totalPages={10} basePath="/genre/28" />);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/genre/28");
  });

  it("keeps other query params like q", () => {
    render(<Pagination currentPage={2} totalPages={10} basePath="/search" query={{ q: "batman" }} />);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/search?q=batman");
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("href", "/search?q=batman&page=3");
  });

  it("encodes special characters in the query", () => {
    render(<Pagination currentPage={1} totalPages={3} basePath="/search" query={{ q: "fast & furious" }} />);
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/search?q=fast+%26+furious&page=2",
    );
  });

  // Gaps and the TMDB limit
  it("shows … for skipped pages", () => {
    render(<Pagination currentPage={6} totalPages={20} basePath="/genre/28" />);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("caps the last page at 500 even if TMDB reports more", () => {
    render(<Pagination currentPage={1} totalPages={1001} basePath="/genre/28" />);
    expect(screen.getByRole("link", { name: "500" })).toBeInTheDocument();
    expect(screen.queryByText("1001")).not.toBeInTheDocument();
  });

  it("disables Next on page 500 when TMDB reports more pages", () => {
    render(<Pagination currentPage={500} totalPages={1001} basePath="/genre/28" />);
    expect(screen.getByText("Next →")).toHaveAttribute("aria-disabled", "true");
  });
});
