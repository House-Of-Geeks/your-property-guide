"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

/**
 * Homepage hero card offering both lead magnets behind a single toggle.
 * The hero's right column is the most valuable surface on the site;
 * instead of betting it all on sellers, the visitor self-selects their
 * path and the card sells the matching guide. Selling stays the default
 * tab (it's the revenue side).
 */

const PATHS = {
  selling: {
    cover: "/images/guide/selling-guide-cover.png",
    coverAlt: "The Complete Guide to Selling Your Property in Australia, 2026 edition",
    title: "The Complete Guide to Selling Your Property",
    tagline: "Ten chapters that routinely save sellers thousands.",
    bullets: [
      "The 10 questions that expose an average agent",
      "Fee negotiation worth $1,700 to $3,400",
      "Presentation that returns 3 to 10x its cost",
      "Printable 12-week selling checklist",
    ],
    href: "/selling-guide",
    footnote: "Personalised to your suburb · 60 seconds · No card, no catch",
  },
  buying: {
    cover: "/images/guide/buying-guide-cover.png",
    coverAlt: "The Complete Guide to Buying Property in Australia, 2026 edition",
    title: "The Complete Guide to Buying Property",
    tagline: "Written for the buyer you actually are.",
    bullets: [
      "2026 schemes state by state, worth tens of thousands",
      "What lenders will actually approve, buffer included",
      "Underquoting and auction psychology, decoded",
      "Printable 12-week buying timeline",
    ],
    href: "/buying-guide",
    footnote: "First home, upgrading, investing or downsizing · 60 seconds",
  },
} as const;

type PathKey = keyof typeof PATHS;

export function GuidePathCard() {
  const [path, setPath] = useState<PathKey>("selling");
  const p = PATHS[path];

  return (
    <div className="rounded-2xl border border-line bg-surface-raised overflow-hidden shadow-card">
      {/* Path toggle: the fork in the road, phrased as the visitor's
          own situation rather than our product names. */}
      <div className="grid grid-cols-2 border-b border-line" role="tablist" aria-label="Choose your guide">
        {(["selling", "buying"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={path === key}
            onClick={() => setPath(key)}
            className={[
              "py-3.5 text-sm font-sans font-semibold transition-colors cursor-pointer",
              path === key
                ? "bg-cta text-white"
                : "bg-surface-warm text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {key === "selling" ? "I’m selling" : "I’m buying"}
          </button>
        ))}
      </div>

      {/* Cover band */}
      <div className="relative bg-surface-inverse px-7 pt-8 pb-7">
        <div className="absolute top-6 right-6">
          <span className="inline-flex items-center rounded-full bg-cta text-white text-[10px] font-sans font-semibold uppercase tracking-wider px-3 py-1">
            Free PDF
          </span>
        </div>
        <div className="flex items-end gap-5">
          <Image
            src={p.cover}
            alt={p.coverAlt}
            width={150}
            height={212}
            className="w-[124px] sm:w-[150px] h-auto rounded-md shadow-[0_18px_40px_rgba(0,0,0,0.5)] -rotate-1"
            priority
          />
          <div className="pb-1">
            <p className="text-[10px] uppercase tracking-[0.26em] text-white/70 font-sans font-medium mb-2">
              2026 edition
            </p>
            <p className="font-display text-white text-xl sm:text-[22px] leading-[1.18] tracking-tight">
              {p.title}
            </p>
            <p className="mt-2 font-sans text-xs text-white/75 leading-relaxed">
              {p.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="px-7 py-6">
        <ul className="space-y-2 mb-5">
          {p.bullets.map((line) => (
            <li key={line} className="flex items-start gap-2.5 font-sans text-sm text-ink leading-snug">
              <span className="text-cta leading-5 shrink-0" aria-hidden="true">✓</span>
              {line}
            </li>
          ))}
        </ul>

        <Link
          href={p.href}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors"
        >
          Get the free guide
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-subtle">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          {p.footnote}
        </p>
      </div>
    </div>
  );
}
