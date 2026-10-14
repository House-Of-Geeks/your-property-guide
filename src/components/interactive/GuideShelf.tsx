"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDE_BOOKS, type GuideBookId } from "@/lib/guide-books";
import { track } from "@/lib/analytics";
import { Book3D } from "./Book3D";

// The two free guides on a shelf (v5, 14 Oct 2026). "Look inside" swings the
// cover open to the contents page. On phones the book is too small to read,
// so the contents also open as a list under it (kept for screen readers on
// desktop, where the book's page shows them).

const BOOK_SIZE = "[--bw:min(250px,42vw)] lg:[--bw:240px] xl:[--bw:280px]";

export function GuideShelf({ guides = ["selling", "buying"], from = "home-shelf" }: { guides?: readonly GuideBookId[]; from?: string }) {
  const [open, setOpen] = useState<GuideBookId | null>(null);
  return (
    <div className={`grid gap-16 ${guides.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {guides.map((id) => (
        <BookStand
          key={id}
          id={id}
          open={open === id}
          from={from}
          onToggle={() => {
            const next = open === id ? null : id;
            setOpen(next);
            if (next) track("tool_used", { tool: "look-inside", guide: id, placement: from });
          }}
        />
      ))}
    </div>
  );
}

function BookStand({ id, open, onToggle, from }: { id: GuideBookId; open: boolean; onToggle: () => void; from: string }) {
  const book = GUIDE_BOOKS[id];
  return (
    <div className="flex flex-col items-center text-center">
      {/* The book itself opens on a click too; keyboards use the button below. */}
      <div onClick={onToggle} className="flex w-full cursor-pointer justify-center pb-6 pt-4">
        <Book3D guide={id} open={open} turn={20} className={BOOK_SIZE} />
      </div>
      <h3 className="mt-8 max-w-sm text-2xl leading-tight text-ink sm:text-[28px]">{book.title}</h3>
      <p className="mt-2 text-base text-ink-muted">10 chapters, 2026 edition, free PDF</p>
      <ol id={`contents-${id}`} hidden={!open} className="mt-6 w-full max-w-md space-y-2 text-left lg:sr-only">
        {book.chapters.map((c, i) => (
          <li key={c.title} className="grid grid-cols-[2rem_1fr] border-t border-line pt-2 text-base text-ink">
            <span className="font-bold text-primary">{i + 1}</span>
            {c.title}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`contents-${id}`}
          className="press inline-flex h-12 items-center rounded-lg border border-ink px-5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse"
        >
          {open ? "Close the book" : "Look inside"}
        </button>
        <Link href={`${book.href}?from=${from}`} className="press inline-flex h-12 items-center gap-3 rounded-lg bg-cta px-5 text-base font-semibold text-white transition-colors hover:bg-cta-hover">
          Get it free <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
