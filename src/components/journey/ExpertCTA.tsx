"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Soft, education-first sidebar CTA. Sits at the END of long-form content
// (guides, suburb pages) for readers who want one-on-one help after they've
// finished reading. Never used as a primary page CTA. Never auto-injected
// above the fold. The brand promise is education first.

interface ExpertCTAProps {
  // Visual variant. "card" for end-of-content, "inline" for mid-article.
  variant?: "card" | "inline";
  // Override default copy if context calls for a different framing.
  headline?: string;
  body?: string;
  ctaLabel?: string;
  href?: string;
  className?: string;
}

// Hormozi-style defaults: name the outcome ("one specialist"), the
// time ("24 hours"), and the cost ("free"). Avoids the generic
// "Get connected" verb that doesn't tell the visitor what happens
// when they click.
const DEFAULT = {
  headline: "Want one-on-one help?",
  body: "If you've done the reading and want a real human to talk it through, we'll find the right specialist for your situation, agent, broker, accountant, conveyancer, whoever fits. ONE specialist, not five. Response within 24 hours. Free for buyers and sellers, no commitment.",
  ctaLabel: "Get matched in 24 hours",
  href: "/find-an-expert",
};

export function ExpertCTA({
  variant = "card",
  headline = DEFAULT.headline,
  body = DEFAULT.body,
  ctaLabel = DEFAULT.ctaLabel,
  href = DEFAULT.href,
  className,
}: ExpertCTAProps) {
  if (variant === "inline") {
    return (
      <div className={`my-8 rounded-xl border border-line-warm bg-surface-warm p-6 ${className ?? ""}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-medium text-ink mb-1">{headline}</p>
            <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
          </div>
          <Link
            href={href}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong text-ink hover:bg-surface-raised hover:border-ink font-medium px-5 py-2.5 transition-colors"
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-12 ${className ?? ""}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-line-warm bg-surface-warm p-8 text-center">
          <h3 className="text-2xl text-ink leading-tight mb-3">{headline}</h3>
          <p className="font-sans text-base text-ink-muted leading-relaxed mb-6 max-w-xl mx-auto">{body}</p>
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong text-ink hover:bg-surface-raised hover:border-ink font-medium px-6 py-3 transition-colors"
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
