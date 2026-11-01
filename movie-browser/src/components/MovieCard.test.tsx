import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MovieCard } from "@/components/MovieCard";
import { makeMovie } from "@/test/fixtures";

// next/image needs the Next.js server and next.config images settings.
// In tests, swap it for a plain <img> (drop Next-only props like fill/sizes).
vi.mock("next/image", () => ({
  default: ({ fill, ...props }: ComponentProps<"img"> & { fill?: boolean }) => {
    void fill; // removed so React doesn't warn about an unknown "fill" attribute
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("MovieCard", () => {
  it("shows the title and links to the movie page", () => {
    render(<MovieCard movie={makeMovie({ id: 27205, title: "Inception" })} />);
    expect(screen.getByRole("heading", { name: "Inception" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/movie/27205");
  });

  // Poster
  it("shows the poster from TMDB with the title as alt text", () => {
    render(<MovieCard movie={makeMovie({ title: "Inception", poster_path: "/abc.jpg" })} />);
    expect(screen.getByRole("img", { name: "Inception" })).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/abc.jpg",
    );
  });

  it('shows "No image" when the movie has no poster', () => {
    render(<MovieCard movie={makeMovie({ poster_path: null })} />);
    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  // Year
  it("shows only the year from the release date", () => {
    render(<MovieCard movie={makeMovie({ release_date: "2010-07-16" })} />);
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("shows no year when the release date is empty", () => {
    const { container } = render(<MovieCard movie={makeMovie({ release_date: "" })} />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  // Rating
  it("shows the rating with one decimal", () => {
    render(<MovieCard movie={makeMovie({ vote_average: 7.456, vote_count: 100 })} />);
    expect(screen.getByText("★ 7.5")).toBeInTheDocument();
  });

  it("hides the rating for movies with no votes yet", () => {
    render(<MovieCard movie={makeMovie({ vote_average: 0, vote_count: 0 })} />);
    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
  });
});
