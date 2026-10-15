import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CampaignCtaKind } from "@/content/articles";
import { AGREEMENT_CHECK, ONE_AGENT } from "@/lib/service-model";

// The article's campaign call to action (15 Oct 2026): the campaign plan, the
// agreement check or one agent, whichever fits why people read it. It sits
// at the end of the article, above the guide offer, so it's an outlined
// button: the guide stays the one solid action.

const CTA: Record<CampaignCtaKind, { title: string; body: string; label: string; href: (from: string) => string }> = {
  "selling-plan": {
    title: "Build your campaign plan",
    body: "Three quick questions about your sale, and your next three steps write themselves, with the tools and guides for your state.",
    label: "Build my campaign plan",
    href: (from) => `/plan?j=selling&from=${from}`,
  },
  "buying-plan": {
    title: "Build your buying plan",
    body: "Every seller’s agent is running a campaign. Run your own: a few quick questions and your next three steps, with the calculators for your state.",
    label: "Build my buying plan",
    href: (from) => `/plan?j=buying&from=${from}`,
  },
  "moving-plan": {
    title: "Plan the sale and the purchase together",
    body: "Get the order and the money right: a few quick questions and your next steps for both sides of the move.",
    label: "Build my moving plan",
    href: (from) => `/plan?j=buying-and-selling&from=${from}`,
  },
  "agreement-check": {
    title: AGREEMENT_CHECK.headline,
    body: AGREEMENT_CHECK.summary,
    label: "Book my agreement check",
    href: (from) => `${AGREEMENT_CHECK.href}?from=${from}`,
  },
  "selling-agent": {
    title: "One agent who runs the campaign",
    body: `When you’re ready, we’ll introduce you to one agent who covers your suburb, checked by us. ${ONE_AGENT}`,
    label: "Find my agent",
    href: (from) => `/get-help?service=selling-agent&from=${from}`,
  },
  "buyers-agent": {
    title: "Get someone on your side",
    body: "A buyer’s agent acts for you, not the seller. Where one takes part in your area we’ll introduce you to one, and we’ll tell you plainly if we can’t.",
    label: "Talk to a buyer’s agent",
    href: (from) => `/get-help?service=buyers-agent&from=${from}`,
  },
};

export function CampaignCta({ kind, from, className = "" }: { kind: CampaignCtaKind; from: string; className?: string }) {
  const c = CTA[kind];
  return (
    <aside aria-label={c.title} className={`not-prose rounded-3xl bg-sand p-6 sm:p-7 ${className}`}>
      <div className="font-display text-[24px] leading-snug text-ink">{c.title}</div>
      <div className="mt-2 text-[16px] leading-relaxed text-ink-muted">{c.body}</div>
      <Link
        href={c.href(from)}
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-ink px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-inverse"
      >
        {c.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}

/** The article's opening hook, set as its lead paragraph. */
export function CampaignHook({ hook }: { hook: string }) {
  return (
    <p className="lead" data-campaign-hook>
      {hook}
    </p>
  );
}
