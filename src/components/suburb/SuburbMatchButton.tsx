import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SuburbMatchButtonProps {
  suburbSlug: string;
  suburbName: string;
}

/**
 * Above-the-fold guide CTA on suburb pages. Lives inside SuburbHero so
 * visitors see it without scrolling, most suburb-page visitors are
 * mid-decision, and the sticky-on-scroll CTA misses them if they bounce
 * before scrolling.
 *
 * Since the June 2026 lead-gen pivot this deep-links the selling-guide
 * funnel with the suburb pre-answered instead of opening the old match
 * drawer. Server component, zero JS.
 */
export function SuburbMatchButton({ suburbSlug, suburbName }: SuburbMatchButtonProps) {
  return (
    <Link
      href={`/selling-guide?suburb=${suburbSlug}`}
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-cta text-ink shadow-lg px-5 py-2.5 text-sm font-semibold hover:bg-cta-hover transition-colors"
    >
      <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-ink shrink-0" aria-hidden="true" />
      Selling in {suburbName}? Free guide
      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}
