"use client";

import { useEffect, useState } from "react";

/**
 * Thin reading-progress bar pinned to the top of the viewport on guide pages.
 *
 * Tracks scroll position relative to the document height (with viewport
 * accounting) and fills a primary-coloured bar across the top. Subtle, fast,
 * passive listener. SSR-safe — renders empty markup on the server, then
 * hydrates with the live value.
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function compute() {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min(100, Math.max(0, (scrolled / max) * 100));
      setProgress(pct);
    }

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-30 h-0.5 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-primary transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
