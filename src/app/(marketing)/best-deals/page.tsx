import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { BestDealCard } from "@/components/best-deal";
import { getLiveBestDeals } from "@/lib/services/best-deal-service";
import { SITE_URL } from "@/lib/constants";
import type { DealAudience, DealPropertyType } from "@/types/best-deal";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

interface PageProps {
  searchParams: Promise<{ state?: string; type?: string; audience?: string }>;
}

const PAGE_PATH = "/best-deals";

export const metadata: Metadata = {
  title: "Best Deals: featured partner properties",
  description:
    "A small, considered set of partner-agent properties worth a closer look. We review every deal before it goes live. Free to browse, and buyers never pay.",
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
};

// ISR — deals refresh nightly via the expiry cron + on-demand by admin
// actions (we'll add revalidatePath calls in those write paths next sprint).
// 6h window in the meantime to keep the page snappy while staying current.
export const revalidate = 21600;

const DEAL_AUDIENCES: { id: DealAudience; label: string }[] = [
  { id: "first-home", label: "First home" },
  { id: "investor",   label: "Investor" },
  { id: "upgrader",   label: "Upgrader" },
  { id: "downsizer",  label: "Downsizer" },
  { id: "renovator",  label: "Renovator" },
];

const PROPERTY_TYPES: { id: DealPropertyType; label: string }[] = [
  { id: "house",      label: "Houses" },
  { id: "apartment",  label: "Apartments" },
  { id: "townhouse",  label: "Townhouses" },
  { id: "land",       label: "Land" },
  { id: "commercial", label: "Commercial" },
];

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

function isAudience(v: string | undefined): v is DealAudience {
  return DEAL_AUDIENCES.some((a) => a.id === v);
}
function isPropertyType(v: string | undefined): v is DealPropertyType {
  return PROPERTY_TYPES.some((t) => t.id === v);
}

export default async function BestDealsPage({ searchParams }: PageProps) {
  const { state, type, audience } = await searchParams;
  const filters = {
    ...(state && STATES.includes(state.toUpperCase() as typeof STATES[number]) ? { state: state.toUpperCase() } : {}),
    ...(isPropertyType(type) ? { propertyType: type } : {}),
    ...(isAudience(audience)  ? { dealType: audience } : {}),
    limit: 60,
  };
  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — the EmptyState below handles a zero-deal result.
  const deals =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([] as Awaited<ReturnType<typeof getLiveBestDeals>>)
      : await getLiveBestDeals(filters);

  const hasFilters = Boolean(state || type || audience);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Best Deals", url: PAGE_PATH }]} />
      <CollectionPageJsonLd
        name="Best Deals: featured partner properties"
        description="A small, considered set of vetted partner-agent properties we think are worth a closer look right now."
        url={PAGE_PATH}
      />

      <PhotoHero photo="investing" breadcrumbs={[{ label: "Best Deals" }]}>
        <p className="text-sm text-ink-muted mb-5">
          From our partners
        </p>
        <HeroTitle>
          Featured opportunities, reviewed first
        </HeroTitle>
        <HeroLead>
          A small, deliberately limited set of partner-agent properties we think are worth a closer
          look. Every deal is reviewed by us before going live. If you ask to be connected, we
          introduce you to one agent, who pays us for the introduction. Buyers never pay.
        </HeroLead>
      </PhotoHero>

      {/* The filters, then the deals, in the first band under the hero. */}
      <Band tone="quiet" spacing="compact">
        <div className="grid sm:grid-cols-3 gap-6">
          <FilterRow label="State" current={state} options={STATES.map((s) => ({ id: s.toLowerCase(), label: s }))} paramName="state" />
          <FilterRow label="Type" current={type} options={PROPERTY_TYPES.map((t) => ({ id: t.id, label: t.label }))} paramName="type" />
          <FilterRow label="Audience" current={audience} options={DEAL_AUDIENCES.map((a) => ({ id: a.id, label: a.label }))} paramName="audience" />
        </div>
        {hasFilters && (
          <div className="mt-5">
            <Link href={PAGE_PATH} className="text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink">
              Clear filters
            </Link>
          </div>
        )}

        <div className="mt-10 border-t border-line pt-10">
          {deals.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <p className="text-sm text-ink-muted mb-6">
                Showing <span className="text-ink font-semibold">{deals.length}</span> featured {deals.length === 1 ? "deal" : "deals"}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((d) => (
                  <BestDealCard key={d.id} deal={d} variant="compact" />
                ))}
              </div>
            </>
          )}
        </div>
      </Band>
    </>
  );
}

function FilterRow({
  label,
  current,
  options,
  paramName,
}: {
  label: string;
  current: string | undefined;
  options: { id: string; label: string }[];
  paramName: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = current?.toLowerCase() === opt.id.toLowerCase();
          return (
            <Link
              key={opt.id}
              href={`?${paramName}=${opt.id}`}
              className={`inline-flex items-center text-sm font-medium rounded-lg px-3 py-1.5 border transition-colors ${
                active
                  ? "border-ink bg-ink text-ink-inverse"
                  : "border-line-strong bg-surface-raised text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-10 sm:p-14 text-center">
      <p className="text-sm text-ink-subtle mb-3">No live deals right now</p>
      <h2 className="text-3xl sm:text-4xl text-ink leading-[1.1] tracking-[-0.025em] mb-4 max-w-xl mx-auto">
        {hasFilters
          ? "Nothing matches those filters at the moment."
          : "Our Best Deals queue is empty right now."}
      </h2>
      <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto mb-8">
        {hasFilters
          ? "Try clearing a filter, or browse the full list."
          : "We keep the queue small and deliberate. Partner agents submit, we review, and only the strongest deals go live. Check back soon."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasFilters && (
          <Link
            href="/best-deals"
            className={BUTTON_SECONDARY}
          >
            Clear filters
          </Link>
        )}
        <Link
          href="/find-an-expert"
          className={BUTTON_PRIMARY}
        >
          Talk to a specialist instead
        </Link>
      </div>
    </div>
  );
}
