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

// Defaults push the selling-guide funnel, the site's single conversion
// point since the June 2026 lead-gen pivot. Name the outcome (the
// complete guide), the time (60 seconds), and the cost (free).
const DEFAULT = {
  headline: "Take the full guide with you.",
  body: "The complete guide to selling property in Australia: what it really costs, how agents price your home, the 10 questions that catch bad agents out, and a 12-week plan to settlement. Free PDF, personalised to your suburb, in your inbox in 60 seconds.",
  ctaLabel: "Get the free selling guide",
  href: "/selling-guide",
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
