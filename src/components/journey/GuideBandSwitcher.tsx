"use client";

import { useState, Suspense } from "react";
import { SellingGuideFunnel } from "./SellingGuideFunnel";
import { BuyingGuideFunnel } from "./BuyingGuideFunnel";

/**
 * The homepage's closing conversion band, with a path toggle so buyers
 * and sellers each get their own pitch and funnel without leaving the
 * page. Selling is the default tab (the revenue side); the toggle is
 * phrased as the visitor's situation, not our product names.
 */

const COPY = {
  selling: {
    headlineLead: "The complete guide to",
    headlineAccent: "selling",
    headlineTail: "your property.",
    pitch:
      "Selling costs 3 to 5 percent of your price. The right moves claw thousands of it back. Ten chapters that show you how, personalised to your suburb, free.",
    steps: [
      ["01", "Answer 7 quick questions (60 seconds)"],
      ["02", "We personalise the guide to your suburb"],
      ["03", "Download instantly, plus a copy by email"],
      ["04", "Selling soon? A free local appraisal if you want one."],
    ],
  },
  buying: {
    headlineLead: "The complete guide to",
    headlineAccent: "buying",
    headlineTail: "property.",
    pitch:
      "Overpaying is the default. Ten chapters written for the buyer you actually are: schemes, finance, inspections, the offer. Free, personalised, 60 seconds.",
    steps: [
      ["01", "Answer 6 quick questions (60 seconds)"],
      ["02", "We point you at the chapters for your situation"],
      ["03", "Download instantly, plus a copy by email"],
      ["04", "Never passed to selling agents. Ever."],
    ],
  },
} as const;

type PathKey = keyof typeof COPY;

export function GuideBandSwitcher() {
  const [path, setPath] = useState<PathKey>("selling");
  const c = COPY[path];

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* Left, pitch */}
      <div className="lg:col-span-5">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-display italic text-cta text-base sm:text-lg leading-none">
            No. 06
          </span>
          <span className="w-12 h-px bg-white/20" aria-hidden="true" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-white/75 font-sans font-medium">
            Free PDF · 2026 edition
          </span>
        </div>

        {/* The fork: which guide is this band selling right now? */}
        <div
          className="inline-flex rounded-full border border-white/25 bg-white/5 p-1 mb-8"
          role="tablist"
          aria-label="Choose your guide"
        >
          {(["selling", "buying"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={path === key}
              onClick={() => setPath(key)}
              className={[
                "rounded-full px-5 py-2 text-sm font-sans font-semibold transition-colors cursor-pointer",
                path === key ? "bg-cta text-white" : "text-white/75 hover:text-white",
              ].join(" ")}
            >
              {key === "selling" ? "I’m selling" : "I’m buying"}
            </button>
          ))}
        </div>

        {/* Re-keyed on toggle so the pitch steps in for each path */}
        <div key={path} className="step-in">
          <h2 className="font-display text-white leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8 font-medium">
            {c.headlineLead}{" "}
            <span className="italic font-light text-cta">{c.headlineAccent}</span>{" "}
            {c.headlineTail}
          </h2>
          <p className="font-display font-light text-xl sm:text-2xl text-white/88 leading-snug max-w-md mb-12">
            {c.pitch}
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 max-w-md">
            {c.steps.map(([n, t], i) => (
              <div
                key={n}
                className="step-in border-t border-white/15 pt-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <p className="font-display italic text-cta text-base mb-1.5 tabular-nums">{n}</p>
                <p className="text-sm text-white/92 leading-snug">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right, the matching funnel */}
      <div className="lg:col-span-7 lg:col-start-6">
        <div key={path} className="step-in">
          <Suspense fallback={null}>
            {path === "selling" ? (
              <SellingGuideFunnel source="homepage-guide" />
            ) : (
              <BuyingGuideFunnel source="homepage-guide" />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
