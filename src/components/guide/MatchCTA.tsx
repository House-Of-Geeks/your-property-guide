"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guideFunnelHref, type GuideAudience } from "@/lib/guide-funnel";
import { useGuidePage } from "./GuideAudienceContext";

// In-content guide CTA. Sits inline mid-article at natural decision points
// (after the "How to interview agents" section in a selling guide, after
// the "How much will I borrow" section in a finance guide, etc.). Visually
// distinct enough to be a CTA, restrained enough not to feel like an
// interstitial ad.
//
// Routes by the page's audience: buyer-persona guides push the buying
// guide, everything else the selling guide (the site's main conversion
// point). GuideArticleLayout supplies the audience and the page slug from
// the guide's frontmatter, so a call site only names the kind; `kind` picks
// the copy for that audience, and authors can override any piece via the
// explicit props.

export type MatchCTAKind =
  | "selling-agent"
  | "mortgage-broker"
  | "buyers-agent"
  | "conveyancer"
  | "builder"
  | "accountant";

type KindCopy = { lead: string; ctaLabel: string };

const SELLING_KIND_DEFAULTS: Record<MatchCTAKind, KindCopy> = {
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

// Copy drawn from the /buying-guide chapter list.
const BUYING_KIND_DEFAULTS: Record<MatchCTAKind, KindCopy> = {
  "selling-agent": {
    lead:     "Buying as well as selling? The free buying guide covers what you can really spend, how not to overpay, and the contract through to settlement.",
    ctaLabel: "Get the free buying guide",
  },
  "mortgage-broker": {
    lead:     "Working out what you can borrow? The free buying guide covers borrowing power, the lender buffer, deposits and LMI, plus the 2026 schemes state by state.",
    ctaLabel: "Get the free buying guide",
  },
  "buyers-agent": {
    lead:     "Inspecting and getting ready to offer? The free buying guide covers how to inspect like a professional, how the selling side plays you, and making the offer.",
    ctaLabel: "Get the free buying guide",
  },
  conveyancer: {
    lead:     "Contract on the way? The free buying guide covers conveyancing, cooling-off by state and settlement day.",
    ctaLabel: "Get the free buying guide",
  },
  builder: {
    lead:     "Buying with renovation in mind? The free buying guide covers what you can really spend and the building and pest checks to run before you offer.",
    ctaLabel: "Get the free buying guide",
  },
  accountant: {
    lead:     "Buying an investment property? The free buying guide covers what you can really spend, investor lending and the true upfront costs.",
    ctaLabel: "Get the free buying guide",
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
  /** Which guide to push. Defaults to the page's audience, else selling. */
  audience?: GuideAudience;
}

export function MatchCTA({ kind, lead, ctaLabel, href, audience: audienceProp }: MatchCTAProps) {
  const page = useGuidePage();
  const audience = audienceProp ?? page.audience ?? "selling";
  const defaults = kind ? (audience === "buying" ? BUYING_KIND_DEFAULTS : SELLING_KIND_DEFAULTS)[kind] : null;
  const resolvedLead  = lead     ?? defaults?.lead     ?? "Want the complete picture before your next step?";
  const resolvedLabel = ctaLabel ?? defaults?.ctaLabel ?? `Get the free ${audience} guide`;
  const resolvedHref  = href ?? guideFunnelHref(audience, { from: page.from });

  return (
    <aside className="not-prose my-8 rounded-xl border border-line p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="flex-1 text-[15px] sm:text-base text-ink leading-snug">
          {resolvedLead}
        </p>
        <Link
          href={resolvedHref}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md border border-ink text-ink hover:bg-ink hover:text-white font-semibold px-5 py-2.5 text-sm"
        >
          {resolvedLabel}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
