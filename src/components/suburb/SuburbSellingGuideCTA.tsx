import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface Props {
  suburbName: string;
  suburbSlug: string;
}

/**
 * Compact selling-guide banner for suburb profiles. Complements the
 * appraisal CTA: the appraisal form captures vendors who are ready to
 * talk to an agent today; this captures the larger group who are months
 * out and researching. Deep-links into /selling-guide with the suburb
 * step pre-answered, which is what turns the suburb-page organic
 * footprint into funnel entries. Server component, zero JS.
 */
export function SuburbSellingGuideCTA({ suburbName, suburbSlug }: Props) {
  return (
    <div className="card-lift rounded-2xl border border-line bg-surface-warm overflow-hidden">
      <div className="px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Free guide · 2026 edition
          </p>
          <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-1.5">
            Thinking of selling in {suburbName}?
          </h3>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-xl">
            The complete guide to selling: what it costs, how agents price
            your home, and a 12-week plan to settlement. Personalised to{" "}
            {suburbName}, free, in 60 seconds.
          </p>
        </div>
        <Link
          href={`/selling-guide?suburb=${suburbSlug}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors"
        >
          Get the free guide
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
