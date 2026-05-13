import Link from "next/link";
import { ArrowRight } from "lucide-react";

// In-content match CTA. Sits inline mid-article at natural decision points
// (after the "How to interview agents" section in a selling guide, after
// the "How much will I borrow" section in a finance guide, etc.). Visually
// distinct enough to be a CTA, restrained enough not to feel like an
// interstitial ad.
//
// `kind` picks the default copy + the deep-link intent. Authors can
// override any individual piece via the explicit props.

export type MatchCTAKind =
  | "selling-agent"
  | "mortgage-broker"
  | "buyers-agent"
  | "conveyancer"
  | "builder"
  | "accountant";

// Each kind maps to: an intent (matches MatchAgent's Intent union, used to
// pre-fill the match flow), a one-line lead and a button label.
const KIND_DEFAULTS: Record<
  MatchCTAKind,
  { intent: string; lead: string; ctaLabel: string }
> = {
  "selling-agent": {
    intent:   "selling",
    lead:     "Want to compare three vetted selling agents who actually sell in your suburb?",
    ctaLabel: "Match me with a selling agent",
  },
  "mortgage-broker": {
    intent:   "refinancing",
    lead:     "Want to talk to a mortgage broker about your situation? They work with 30+ lenders, not one bank.",
    ctaLabel: "Talk to a mortgage broker",
  },
  "buyers-agent": {
    intent:   "buying",
    lead:     "Want a buyer's agent who knows this market and works for you, not the seller?",
    ctaLabel: "Match me with a buyer's agent",
  },
  conveyancer: {
    intent:   "something-else",
    lead:     "Want a conveyancer in your state who'll handle this end to end?",
    ctaLabel: "Find a conveyancer",
  },
  builder: {
    intent:   "something-else",
    lead:     "Want to talk to a builder or quantity surveyor about this project?",
    ctaLabel: "Talk to a builder",
  },
  accountant: {
    intent:   "something-else",
    lead:     "Want a property-tax accountant who'll model the numbers before you commit?",
    ctaLabel: "Talk to an accountant",
  },
};

interface MatchCTAProps {
  /** Picks default copy + intent. Required unless every field below is overridden. */
  kind?: MatchCTAKind;
  /** Override the lead copy. */
  lead?: string;
  /** Override the button label. */
  ctaLabel?: string;
  /** Override the deep-link intent. Defaults to the kind's intent. */
  intent?: string;
  /** Override the destination href entirely (skips the intent param). */
  href?: string;
}

export function MatchCTA({ kind, lead, ctaLabel, intent, href }: MatchCTAProps) {
  const defaults = kind ? KIND_DEFAULTS[kind] : null;
  const resolvedLead     = lead     ?? defaults?.lead     ?? "Want one-on-one help with this stage?";
  const resolvedLabel    = ctaLabel ?? defaults?.ctaLabel ?? "Get connected";
  const resolvedIntent   = intent   ?? defaults?.intent;
  const resolvedHref     = href     ?? (resolvedIntent ? `/?intent=${resolvedIntent}#match` : "/#match");

  return (
    <aside className="my-8 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">
            Talk to a person
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
        Free for buyers and sellers. We&rsquo;re paid by the specialist if work goes ahead, never by you.
      </p>
    </aside>
  );
}
