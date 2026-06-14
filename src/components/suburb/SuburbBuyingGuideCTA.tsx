import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface Props {
  suburbName: string;
  suburbSlug: string;
}

/**
 * Compact buying-guide banner for suburb profiles. Mirrors the selling-guide
 * CTA and sits beside it: where the selling band captures vendors who are
 * months out, this captures the larger group researching a purchase. Deep-links
 * into /buying-guide with the suburb step pre-answered, turning the suburb-page
 * organic footprint into buyer-side funnel entries.
 *
 * Carries the commissioned Queenslander artwork on the right (sm+), matching
 * the selling band so the two read as one brand surface. Server component,
 * zero JS.
 */
export function SuburbBuyingGuideCTA({ suburbName, suburbSlug }: Props) {
  return (
    <div className="card-lift relative rounded-2xl border border-line bg-surface-warm overflow-hidden">
      {/* Artwork strip, fades in from the right behind the CTA button */}
      <div className="absolute inset-y-0 right-0 w-[46%] hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <Image
          src="/images/art/queenslander.jpg"
          alt=""
          fill
          sizes="(min-width: 640px) 40vw, 0px"
          className="object-cover object-[65%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-warm via-surface-warm/55 to-surface-warm/5" />
      </div>

      <div className="relative px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1 sm:max-w-[58%]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            Free guide · 2026 edition
          </p>
          <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-1.5">
            Thinking of buying in {suburbName}?
          </h3>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-xl">
            What you can actually spend, the 2026 first home buyer schemes for
            your state, and how not to overpay. A free buying guide, in about 60
            seconds.
          </p>
        </div>
        <Link
          href={`/buying-guide?suburb=${suburbSlug}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3.5 text-sm transition-colors shadow-lg"
        >
          Get the free buying guide
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
