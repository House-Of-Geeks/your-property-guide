import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BestDealCard } from "./BestDealCard";
import { getContextualBestDeals } from "@/lib/services/best-deal-service";
import type { DealAudience } from "@/types/best-deal";

// Async server component. Use on the homepage and persona hubs to surface
// 4–6 contextually-relevant Best Deals. Renders nothing if no live deals
// exist — never an empty rail.

interface BestDealsRailProps {
  /** Filter to a specific audience (matches DealAudience union). */
  dealType?: DealAudience;
  /** Filter to a specific state — uppercase code like "QLD". */
  state?: string;
  /** Title shown above the rail. */
  heading?: string;
  /** Eyebrow above the heading. */
  eyebrow?: string;
  /** Optional copy under the heading. */
  body?: string;
  /** Number of cards to render. Default 6. */
  limit?: number;
  className?: string;
}

export async function BestDealsRail({
  dealType,
  state,
  heading = "Featured opportunities",
  eyebrow = "From our partners",
  body = "A small set of vetted partner properties we think are worth a closer look right now. We review every deal before it goes live.",
  limit = 6,
  className,
}: BestDealsRailProps) {
  // Skip the DB during `next build` (Railway proxy drops build-time
  // connections); this rail is in a Suspense fallback={null} and ISR fills it
  // with real deals on first request.
  const deals =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([] as Awaited<ReturnType<typeof getContextualBestDeals>>)
      : await getContextualBestDeals({ dealType, state, limit });
  if (deals.length === 0) return null;

  return (
    <section className={`py-12 sm:py-16 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 mb-8 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mb-3">{eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
              {heading}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <Link
              href="/best-deals"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary border-b border-line-strong hover:border-primary pb-0.5 transition-colors"
            >
              See all Best Deals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        {body && (
          <p className="font-sans text-base text-ink-muted leading-relaxed mb-8 max-w-2xl">
            {body}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((deal) => (
            <BestDealCard key={deal.id} deal={deal} variant="compact" />
          ))}
        </div>
        <p className="text-[11px] font-sans text-ink-subtle mt-6 leading-relaxed">
          Partner-disclosed featured properties. We&rsquo;re paid only when matched work goes ahead.
          Buyers and sellers never pay. <Link href="/about" className="underline decoration-line-strong hover:text-ink">Why we feature these</Link>.
        </p>
      </div>
    </section>
  );
}
