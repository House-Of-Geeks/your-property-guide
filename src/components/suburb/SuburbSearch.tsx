"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Suggestion {
  slug: string;
  name: string;
  state: string;
  postcode: string;
}

export function SuburbSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    const res = await fetch(`/api/suburbs/search?q=${encodeURIComponent(q)}`);
    const data: Suggestion[] = await res.json();
    setSuggestions(data);
    setOpen(data.length > 0);
    setActiveIdx(-1);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function navigate(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/suburbs/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        navigate(suggestions[activeIdx].slug);
      } else if (suggestions.length > 0) {
        navigate(suggestions[0].slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative hidden sm:flex items-center flex-shrink-0">
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search by suburb or postcode"
          className="w-64 lg:w-80 h-9 px-3 text-sm border border-gray-300 border-r-0 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <button
          type="button"
          onClick={() => {
            if (activeIdx >= 0 && suggestions[activeIdx]) navigate(suggestions[activeIdx].slug);
            else if (suggestions.length > 0) navigate(suggestions[0].slug);
          }}
          className="h-9 w-9 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-r-md transition-colors flex-shrink-0"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.slug}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); navigate(s.slug); }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm ${
                i === activeIdx ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-gray-400 text-xs">{s.state} {s.postcode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
