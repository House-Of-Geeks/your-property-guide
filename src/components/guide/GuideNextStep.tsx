import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuideCover } from "@/components/brand/GuideCover";
import { guideFunnelHref, type GuideAudience } from "@/lib/guide-funnel";

const COPY: Record<GuideAudience, { rail: string; heading: string; body: string }> = {
  selling: {
    rail: "Pricing, agent fees, choosing an agent and settlement, personalised to your suburb.",
    heading: "Selling soon? Get the free selling guide",
    body: "Pricing your home, real agent fees, choosing an agent and getting to settlement, in one free guide personalised to your suburb.",
  },
  buying: {
    rail: "What you can really spend, the 2026 schemes by state, and how not to overpay.",
    heading: "Buying soon? Get the free buying guide",
    body: "What you can really spend, the 2026 schemes state by state, how homes are marketed and sold, and how not to overpay. Free, personalised to your situation.",
  },
};

interface GuideNextStepProps {
  audience: GuideAudience;
  /** Slug of the page, recorded with the lead as ?from=. */
  from: string;
  /** "rail": the compact card under the desktop contents. "block": the end-of-article action. */
  variant?: "rail" | "block";
  heading?: string;
  body?: string;
}

/**
 * The one next step a guide offers, routed by the page's audience: the free
 * selling guide (plus an appraisal link) for sellers, the free buying guide
 * for buyers. Seller pages use GuideStartInline for the end block, which
 * asks the funnel's first question in place; this is the link form.
 */
export function GuideNextStep({ audience, from, variant = "block", heading, body }: GuideNextStepProps) {
  const href = guideFunnelHref(audience, { from });
  const copy = COPY[audience];

  if (variant === "rail") {
    return (
      <div className="rounded-xl border border-line p-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 shrink-0 text-[4.2px]" aria-hidden="true">
            <GuideCover guide={audience} />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-ink leading-snug">The free {audience} guide</p>
            <p className="mt-1 text-sm text-ink-muted leading-snug">{copy.rail}</p>
          </div>
        </div>
        <Link
          href={href}
          className="mt-4 flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink font-semibold px-4 py-2.5 text-sm"
        >
          Get the free guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        {audience === "selling" && (
          <p className="mt-3 text-center text-sm text-ink-muted">
            or{" "}
            <Link href="/appraisal" className="text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
              ask for a free appraisal
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <aside className="not-prose my-10 rounded-xl border border-line bg-surface-warm p-5 sm:p-7">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="w-[58px] sm:w-[76px] shrink-0 text-[5.5px] sm:text-[7.2px] pt-0.5" aria-hidden="true">
          <GuideCover guide={audience} />
        </div>
        <div className="min-w-0">
          <p className="text-[1.25rem] sm:text-2xl font-bold text-ink leading-[1.15] tracking-[-0.02em]">
            {heading ?? copy.heading}
          </p>
          <p className="mt-2 text-[15px] sm:text-base text-ink-muted leading-relaxed">{body ?? copy.body}</p>
        </div>
      </div>
      <div className="mt-5 sm:pl-[100px]">
        <Link
          href={href}
          className="flex sm:inline-flex items-center justify-center gap-2 rounded-md bg-cta hover:bg-cta-hover text-cta-ink font-semibold px-6 py-3.5 sm:py-3 text-base"
        >
          Get the free {audience} guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <p className="mt-3 text-sm text-ink-muted">Free PDF. Takes about a minute.</p>
      </div>
    </aside>
  );
}
