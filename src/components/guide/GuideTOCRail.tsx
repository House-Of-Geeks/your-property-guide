"use client";

import { useEffect, useState } from "react";

interface Entry {
  id: string;
  label: string;
  level?: 2 | 3;
}

/**
 * The sticky "In this guide" rail on desktop. It marks the section the
 * reader is in: the last heading that has scrolled above the top band of the
 * viewport. Server-rendered as plain anchors, so it works before hydration.
 */
export function GuideTOCRail({ entries, title = "In this guide" }: { entries: readonly Entry[]; title?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const e of entries) {
        const el = document.getElementById(e.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) current = e.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [entries]);

  return (
    <nav aria-label={title}>
      <p className="text-sm font-semibold text-ink mb-3">{title}</p>
      <ul className="border-l border-line">
        {entries.map((e) => {
          const on = active === e.id;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors ${
                  e.level === 3 ? "pl-7" : "pl-4"
                } ${on ? "border-ink text-ink font-medium" : "border-transparent text-ink-muted hover:text-ink"}`}
              >
                {e.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
