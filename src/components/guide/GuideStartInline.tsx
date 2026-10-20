"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { GuideCover } from "@/components/brand/GuideCover";
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
    <aside className={`not-prose rounded-xl border border-line bg-surface-warm p-5 sm:p-7 ${className}`}>
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="w-[58px] sm:w-[76px] shrink-0 text-[5.5px] sm:text-[7.2px] pt-0.5" aria-hidden="true">
          <GuideCover guide="selling" />
        </div>
        <div className="min-w-0">
          <p className="text-[1.25rem] sm:text-2xl font-bold text-ink leading-[1.15] tracking-[-0.02em]">{heading}</p>
          <p className="mt-2 text-[15px] sm:text-base text-ink-muted leading-relaxed">{body}</p>
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-ink">Where is the property?</p>
      <div className="mt-2 flex flex-col sm:flex-row sm:items-stretch gap-2.5">
        {/* relative z-10 keeps the suggestion list above later blocks
            that make their own stacking context. */}
        <div ref={inputWrap} className="relative z-10 flex-1 min-w-0">
          <SuburbAutocomplete
            size="lg"
            placeholder="Your suburb or postcode"
            onSelectLocation={(slug) => start(slug)}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setNudge(true);
            inputWrap.current?.querySelector("input")?.focus();
          }}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink font-semibold px-6 py-3.5 text-base cursor-pointer"
        >
          Start my free guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-ink-muted">
        <span aria-live="polite">
          {nudge ? "Type your suburb, then pick it from the list." : "Free PDF, personalised to your suburb. Takes about a minute."}
        </span>
        <Link
          href={guideFunnelHref("selling", { from })}
          className="underline underline-offset-4 decoration-line-strong hover:text-ink hover:decoration-ink"
        >
          Open the guide without a suburb
        </Link>
      </div>
    </aside>
  );
}
