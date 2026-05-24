"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MatchDrawer } from "@/components/journey/MatchDrawer";

interface SuburbMatchButtonProps {
  suburbSlug: string;
  suburbName: string;
}

/**
 * Above-the-fold match CTA on suburb pages. Lives inside SuburbHero so
 * visitors see it without scrolling, most suburb-page visitors are
 * mid-decision, and the original sticky-on-scroll CTA missed them if
 * they bounced before scrolling.
 *
 * Opens the same MatchDrawer as the sticky CTA, pre-filled with this
 * suburb's slug so the visitor skips straight to the timeframe question.
 */
export function SuburbMatchButton({ suburbSlug, suburbName }: SuburbMatchButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-cta text-ink shadow-lg px-5 py-2.5 text-sm font-semibold hover:bg-cta-hover transition-colors cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-ink shrink-0" aria-hidden="true" />
        Talk to a {suburbName} specialist
        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      </button>

      <MatchDrawer
        open={open}
        onClose={() => setOpen(false)}
        suburb={suburbSlug}
        source="suburb-hero-cta"
        heading={`Find your ${suburbName} specialist`}
        subhead="Buying, selling, or researching? Three quick questions and we match you with one vetted local expert. Free, no commitment."
      />
    </>
  );
}
