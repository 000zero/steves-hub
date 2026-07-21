"use client";

import { Rocket, Search } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import ThemeToggle from "../ThemeToggle";

export default function TopNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<HTMLElement[]>([]);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("search:query", { detail: query }));
  }, [query]);

  useEffect(() => {
    const updateMatches = () => {
      const marks = Array.from(document.querySelectorAll('mark[data-search-highlight="true"]')) as HTMLElement[];
      setMatches(marks);
      if (marks.length === 0) {
        setActiveMatchIndex(0);
      }
    };

    updateMatches();
    const timer = window.setTimeout(updateMatches, 0);
    return () => window.clearTimeout(timer);
  }, [query]);

  const goToMatch = (index: number) => {
    if (!matches.length) return;

    const nextIndex = (index + matches.length) % matches.length;
    setActiveMatchIndex(nextIndex);
    matches[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToMatch(activeMatchIndex + 1);
    }
  };

  return (
    <header className="border-b border-[#30363d] bg-[#25292e]">
      <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3 sm:gap-6">
            <Rocket className="text-[#e6edf3]" size={28} />

            <span className="font-semibold text-[#e6edf3]">Steve's Hub</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <div className="relative w-72">
                <Search
                  className="absolute left-3 top-2.5 text-[#e6edf3]"
                  size={16}
                />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-md border border-border light:bg-background py-2 pl-9 pr-16 text-sm text-[#ffffff] outline-none focus:border-blue-500"
                  placeholder="Search resume..."
                />

                {query.trim() && matches.length > 0 ? (
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[#e6edf3]">
                    {activeMatchIndex + 1} / {matches.length}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-[#25292e] text-[#e6edf3] sm:hidden"
              aria-label="Toggle search"
            >
              <Search size={16} />
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out sm:hidden ${
            isSearchOpen ? "mt-3 max-h-28 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-[#e6edf3]"
                size={16}
              />

              <input
                autoFocus={isSearchOpen}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-md border border-[#e6edf3] bg-[#25292e] py-2 pl-9 pr-4 text-sm text-[#ffffff] outline-none focus:border-blue-500"
                placeholder="Search resume..."
              />
            </div>

            {query.trim() && matches.length > 0 ? (
              <div className="flex items-center justify-between text-xs text-[#e6edf3]">
                <span>
                  {activeMatchIndex + 1} / {matches.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => goToMatch(activeMatchIndex - 1)}
                    className="rounded border border-[#e6edf3]/40 px-2 py-1"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => goToMatch(activeMatchIndex + 1)}
                    className="rounded border border-[#e6edf3]/40 px-2 py-1"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}