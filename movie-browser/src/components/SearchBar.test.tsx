import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/SearchBar";

// SearchBar reads the URL and navigates, which needs the Next.js router.
// Fake both so each test controls the current URL and can check where it navigates.
const push = vi.fn();
let currentParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => currentParams,
}));

const setUrl = (query: string) => {
  currentParams = new URLSearchParams(query);
};

beforeEach(() => {
  push.mockClear();
  setUrl("");
});

const getInput = () => screen.getByRole("searchbox", { name: "Search movies" });

describe("SearchBar", () => {
  // Initial value from the URL
  it("starts empty when there is no ?q=", () => {
    render(<SearchBar />);
    expect(getInput()).toHaveValue("");
  });

  it("shows the current search from ?q=", () => {
    setUrl("q=batman");
    render(<SearchBar />);
    expect(getInput()).toHaveValue("batman");
  });

  // Submitting
  it("navigates to the search page on Enter", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(getInput(), "batman{Enter}");
    expect(push).toHaveBeenCalledWith("/search?q=batman");
  });

  it("trims spaces before searching", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(getInput(), "   the matrix   {Enter}");
    expect(push).toHaveBeenCalledWith("/search?q=the%20matrix");
  });

  it("encodes special characters in the URL", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(getInput(), "fast & furious{Enter}");
    expect(push).toHaveBeenCalledWith("/search?q=fast%20%26%20furious");
  });

  it.each([
    ["empty", "{Enter}"],
    ["only spaces", "    {Enter}"],
  ])("does nothing when the search is %s", async (_label, keys) => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(getInput(), keys);
    expect(push).not.toHaveBeenCalled();
  });

  it("can edit the current search and submit the new one", async () => {
    const user = userEvent.setup();
    setUrl("q=batman");
    render(<SearchBar />);

    await user.clear(getInput());
    await user.type(getInput(), "superman{Enter}");
    expect(push).toHaveBeenCalledWith("/search?q=superman");
  });

  // The key={urlQuery} reset (e.g. back button or clicking the logo)
  it("resets the input when the URL query changes", async () => {
    const user = userEvent.setup();
    setUrl("q=batman");
    const { rerender } = render(<SearchBar />);

    await user.type(getInput(), " begins"); // typed but not submitted
    expect(getInput()).toHaveValue("batman begins");

    setUrl("q=joker"); // e.g. user pressed Back
    rerender(<SearchBar />);
    expect(getInput()).toHaveValue("joker");

    setUrl(""); // e.g. user clicked the logo -> home page
    rerender(<SearchBar />);
    expect(getInput()).toHaveValue("");
  });
});
