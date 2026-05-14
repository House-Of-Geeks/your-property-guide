import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { BestDealCard } from "@/components/best-deal";
import { getLiveBestDeals } from "@/lib/services/best-deal-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { DealAudience, DealPropertyType } from "@/types/best-deal";

interface PageProps {
  searchParams: Promise<{ state?: string; type?: string; audience?: string }>;
}

const PAGE_PATH = "/best-deals";

export const metadata: Metadata = {
  title: `Best Deals: featured partner properties | ${SITE_NAME}`,
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
  const deals = await getLiveBestDeals(filters);

  const hasFilters = Boolean(state || type || audience);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Best Deals", url: PAGE_PATH }]} />
      <CollectionPageJsonLd
        name="Best Deals: featured partner properties"
        description="A small, considered set of vetted partner-agent properties we think are worth a closer look right now."
        url={PAGE_PATH}
      />

      <section className="relative bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Best Deals" }]} />
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-cta mt-6 mb-3">
            From our partners
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-tight max-w-3xl mb-5">
            Featured opportunities, reviewed first.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            A small, deliberately limited set of partner-agent properties we think are worth a closer
            look. Every deal is reviewed by us before going live. We&rsquo;re paid only when matched
            work goes ahead. Buyers never pay.
          </p>
        </div>
      </section>

      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid sm:grid-cols-3 gap-3">
            <FilterRow label="State" current={state} options={STATES.map((s) => ({ id: s.toLowerCase(), label: s }))} paramName="state" />
            <FilterRow label="Type" current={type} options={PROPERTY_TYPES.map((t) => ({ id: t.id, label: t.label }))} paramName="type" />
            <FilterRow label="Audience" current={audience} options={DEAL_AUDIENCES.map((a) => ({ id: a.id, label: a.label }))} paramName="audience" />
          </div>
          {hasFilters && (
            <div className="mt-4">
              <Link href={PAGE_PATH} className="text-sm font-medium text-ink hover:text-primary underline decoration-line-strong underline-offset-4">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {deals.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <p className="font-sans text-sm text-ink-muted mb-6">
                Showing <span className="text-ink font-medium">{deals.length}</span> featured {deals.length === 1 ? "deal" : "deals"}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {deals.map((d) => (
                  <BestDealCard key={d.id} deal={d} variant="compact" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
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
      <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = current?.toLowerCase() === opt.id.toLowerCase();
          return (
            <Link
              key={opt.id}
              href={`?${paramName}=${opt.id}`}
              className={`inline-flex items-center text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                active
                  ? "border-ink bg-ink text-surface-raised"
                  : "border-line-strong text-ink-muted hover:border-ink hover:text-ink"
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
    <div className="rounded-2xl border border-line bg-surface-warm p-10 sm:p-14 text-center">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">No live deals right now</p>
      <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-3 max-w-xl mx-auto">
        {hasFilters
          ? "Nothing matches those filters at the moment."
          : "Our Best Deals queue is empty right now."}
      </h2>
      <p className="font-sans text-base text-ink-muted leading-relaxed max-w-xl mx-auto mb-6">
        {hasFilters
          ? "Try clearing a filter, or browse the full list."
          : "We keep the queue small and deliberate. Partner agents submit, we review, and only the strongest deals go live. Check back soon."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasFilters && (
          <Link
            href="/best-deals"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong text-ink hover:bg-surface-raised hover:border-ink font-medium px-5 py-2.5 text-sm transition-colors"
          >
            Clear filters
          </Link>
        )}
        <Link
          href="/find-an-expert"
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink text-surface-raised hover:bg-primary font-medium px-5 py-2.5 text-sm transition-colors"
        >
          Talk to a specialist instead
        </Link>
      </div>
    </div>
  );
}
