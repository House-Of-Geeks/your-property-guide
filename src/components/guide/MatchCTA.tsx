import Link from "next/link";
import { ArrowRight } from "lucide-react";

// In-content guide CTA. Sits inline mid-article at natural decision points
// (after the "How to interview agents" section in a selling guide, after
// the "How much will I borrow" section in a finance guide, etc.). Visually
// distinct enough to be a CTA, restrained enough not to feel like an
// interstitial ad.
//
// Since the June 2026 lead-gen pivot every kind pushes the selling-guide
// funnel (the site's single conversion point) with a contextual lead, so
// a buyer reading the LMI guide and a vendor reading the agent-fees guide
// each get a line that makes sense where they are. `kind` picks the copy;
// authors can override any piece via the explicit props.

export type MatchCTAKind =
  | "selling-agent"
  | "mortgage-broker"
  | "buyers-agent"
  | "conveyancer"
  | "builder"
  | "accountant";

const KIND_DEFAULTS: Record<MatchCTAKind, { lead: string; ctaLabel: string }> = {
  "selling-agent": {
    lead:     "Choosing an agent soon? The free selling guide has the 10 questions that catch bad agents out, plus fee benchmarks for your state.",
    ctaLabel: "Get the free selling guide",
  },
  "mortgage-broker": {
    lead:     "Upgrading or refinancing around a sale? The free selling guide covers the sell side: costs, timing, and selling and buying at the same time.",
    ctaLabel: "Get the free selling guide",
  },
  "buyers-agent": {
    lead:     "Most buyers have a property to sell first. The free selling guide covers costs, agent selection and a 12-week plan for the sale side of your move.",
    ctaLabel: "Get the free selling guide",
  },
  conveyancer: {
    lead:     "Selling as well? The free guide walks through contracts, vendor disclosure and settlement, state by state.",
    ctaLabel: "Get the free selling guide",
  },
  builder: {
    lead:     "Renovating before a sale? Chapter 4 of the free selling guide covers which fixes pay for themselves and which never do.",
    ctaLabel: "Get the free selling guide",
  },
  accountant: {
    lead:     "Selling an investment property? The free guide covers CGT, the real costs of selling, and timing the exit.",
    ctaLabel: "Get the free selling guide",
  },
};

interface MatchCTAProps {
  /** Picks default copy. Required unless every field below is overridden. */
  kind?: MatchCTAKind;
  /** Override the lead copy. */
  lead?: string;
  /** Override the button label. */
  ctaLabel?: string;
  /** Legacy prop, no longer used for routing. Kept so old call sites compile. */
  intent?: string;
  /** Override the destination href entirely. */
  href?: string;
}

export function MatchCTA({ kind, lead, ctaLabel, href }: MatchCTAProps) {
  const defaults = kind ? KIND_DEFAULTS[kind] : null;
  const resolvedLead  = lead     ?? defaults?.lead     ?? "Want the complete picture before your next step?";
  const resolvedLabel = ctaLabel ?? defaults?.ctaLabel ?? "Get the free selling guide";
  const resolvedHref  = href ?? "/selling-guide";

  return (
    <aside className="my-8 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">
            Free guide · 2026 edition
          </p>
          <p className="font-sans text-base text-ink leading-snug">
            {resolvedLead}
          </p>
        </div>
        <Link
          href={resolvedHref}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface-raised text-ink hover:bg-ink hover:text-surface-raised hover:border-ink font-medium px-5 py-2.5 transition-colors"
        >
          {resolvedLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-[11px] font-sans text-ink-subtle mt-3 leading-relaxed">
        Free PDF, personalised to your suburb. 60 seconds, no card, no catch.
      </p>
    </aside>
  );
}
