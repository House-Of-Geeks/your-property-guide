"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { clarityEvent, clarityTag } from "@/lib/clarity";
import { guideFunnelHref } from "@/lib/guide-funnel";

interface GuideStartInlineProps {
  /** Slug of the page this sits on; recorded with the lead as ?from=. */
  from: string;
  heading?: string;
  body?: string;
  /** Outer spacing; defaults to the in-article rhythm. */
  className?: string;
}

/**
 * Starts the selling-guide funnel in place. Readers of the commission and
 * fees guides were the site's sellers, but an outline button to a landing
 * page lost most of them; this asks the funnel's first question (where's
 * the property?) on the page they're reading. Picking a suburb opens
 * /selling-guide?suburb=…&from=… at the form, where the funnel reads
 * ?suburb= and starts on question two. The skip link opens the guide
 * without a suburb.
 */
export function GuideStartInline({
  from,
  heading = "Selling soon? Get the free selling guide",
  body = "Pricing your home, real agent fees, choosing an agent and getting to settlement, in one free guide personalised to your suburb.",
  className = "my-10",
}: GuideStartInlineProps) {
  const router = useRouter();
  const inputWrap = useRef<HTMLDivElement>(null);
  const [nudge, setNudge] = useState(false);

  const start = (suburb: string) => {
    clarityEvent("guide_inline_start");
    clarityTag("guide_inline_from", from);
    router.push(guideFunnelHref("selling", { suburb, from, toForm: true }));
  };

  return (
    <aside className={`not-prose rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8 ${className}`}>
      <div className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-2">{heading}</div>
      <div className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed mb-5 max-w-2xl">{body}</div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* relative z-10 keeps the suggestion list above later blocks
            that make their own stacking context. */}
        <div ref={inputWrap} className="relative z-10 flex-1 rounded-xl border border-line-strong bg-surface-raised">
          <SuburbAutocomplete
            placeholder="Your suburb or postcode, e.g. Paddington or 4064"
            onSelectLocation={(slug) => start(slug)}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setNudge(true);
            inputWrap.current?.querySelector("input")?.focus();
          }}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-semibold px-6 py-3 text-sm transition-colors cursor-pointer"
        >
          Start my free guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-sans text-xs text-ink-subtle">
        <span aria-live="polite">
          {nudge ? "Type your suburb, then pick it from the list." : "Free PDF. 60 seconds, no card, no catch."}
        </span>
        <Link
          href={guideFunnelHref("selling", { from })}
          className="text-ink-muted underline underline-offset-4 decoration-line-strong hover:text-ink hover:decoration-ink transition-colors"
        >
          or skip to the guide
        </Link>
      </div>
    </aside>
  );
}
