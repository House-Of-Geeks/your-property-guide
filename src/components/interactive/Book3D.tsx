"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";

// A guide as a real book (v5, 14 Oct 2026): cover, spine, page edges and
// back, drawn in CSS 3D (globals.css, .book3d). It turns a little with the
// pointer and, when `open`, swings its cover back to show the contents.
// Motion only answers the person's own pointer or click (BRAND.md §5).

interface Book3DProps {
  guide: GuideBookId;
  /** Any CSS length, e.g. "220px". Leave out to size it with a class, e.g. "[--bw:180px] lg:[--bw:260px]". */
  width?: string;
  open?: boolean;
  /** A chapter (0-based) to mark on the contents page. */
  highlight?: number | null;
  /** Turn towards the pointer while it's over the book. */
  tilt?: boolean;
  /** Resting turn, in degrees. */
  turn?: number;
  className?: string;
  style?: CSSProperties;
}

export function Book3D({ guide, width, open = false, highlight = null, tilt = true, turn = 24, className = "", style }: Book3DProps) {
  const book = GUIDE_BOOKS[guide];
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || open || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${turn + x * 22}deg`);
    el.style.setProperty("--rx", `${-6 - y * 14}deg`);
  };
  const onLeave = () => {
    ref.current?.style.removeProperty("--ry");
    ref.current?.style.removeProperty("--rx");
  };

  return (
    <div
      ref={ref}
      className={`book3d ${className}`}
      data-open={open ? "true" : "false"}
      style={{ ...(width ? { "--bw": width } : {}), "--turn": `${turn}deg`, "--book": book.colour, "--spine": book.spine, ...style } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
    >
      <span className="book3d__shadow" />
      <div className="book3d__body">
        <span className="book3d__back" />
        <span className="book3d__spine" />
        <span className="book3d__edge" />
        <span className="book3d__top" />
        <div className="book3d__page">
          <p className="book3d__contents-title">Contents</p>
          <ol className="book3d__contents">
            {book.chapters.map((c, i) => (
              <li key={c.title} data-on={i === highlight ? "" : undefined}>
                <span>{i + 1}</span>
                {c.title}
              </li>
            ))}
          </ol>
        </div>
        <div className="book3d__cover">
          <div className="book3d__cover-front">
            {/* A plain img: the cover is a fixed, small asset and must sit inside the 3D transform. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={book.cover} alt="" draggable={false} />
          </div>
          <div className="book3d__cover-inside">
            <span>Your Property Guide</span>
            <span>2026 edition</span>
          </div>
        </div>
      </div>
    </div>
  );
}
