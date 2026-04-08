"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/utils/blog-toc";

interface Props {
  toc: TocItem[];
}

export function BlogTableOfContents({ toc }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        On this page
      </p>
      <ul className="space-y-1">
        {toc.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block text-sm leading-snug py-1 border-l-2 transition-colors ${
                level === 3 ? "pl-5" : "pl-3"
              } ${
                activeId === id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-6 rounded-xl bg-black p-4 text-white">
        <p className="text-sm font-semibold">Explore suburb data</p>
        <p className="text-xs mt-1 text-white/80">
          Median prices, growth trends, schools and more.
        </p>
        <a
          href="/suburbs"
          className="mt-3 block text-center rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          Browse suburbs &rarr;
        </a>
      </div>
    </nav>
  );
}
