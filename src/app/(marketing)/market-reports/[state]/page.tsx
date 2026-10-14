import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, Home, DollarSign } from "lucide-react";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getStateMarketData,
  getStateNameForReport,
  type SuburbMarketRow,
} from "@/lib/services/market-report-service";
import { formatPrice, formatPriceFull } from "@/lib/utils/format";
import { STATE_COMMENTARY } from "@/lib/data/state-commentary";
import { priceSourceLine, stateRankingLink } from "@/lib/ranking-notes";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

const STATE_SLUGS = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"] as const;
type StateSlug = (typeof STATE_SLUGS)[number];

const CURRENT_YEAR = 2026;

function isValidState(slug: string): slug is StateSlug {
  return (STATE_SLUGS as readonly string[]).includes(slug);
}

export const revalidate = 86400; // cache as ISR for 24h, regen on demand

export function generateStaticParams() {
  // Skip prerender at build time, page body queries the Suburb table and the
  // DB isn't reachable during `next build`. Pages render on-demand at runtime.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  if (!isValidState(state)) return {};
  const stateName = getStateNameForReport(state);
  const title = `${stateName} Property Market Report ${CURRENT_YEAR}`;
  const description = `${stateName} property market data for ${CURRENT_YEAR}: median prices, the most affordable and highest-priced suburbs, and where each figure comes from.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/market-reports/${state}` },
    openGraph: {
      url: `${SITE_URL}/market-reports/${state}`,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
    },
    twitter: { card: "summary_large_image" },
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="tone-light rounded-xl border border-line bg-surface-raised p-6">
      <div className="flex items-center gap-2 mb-4 text-ink-subtle">
        {icon}
        <p className="text-sm">{label}</p>
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-ink leading-none tracking-[-0.03em]">{value}</p>
      {sub && (
        <p className="mt-3 text-sm text-ink-subtle">{sub}</p>
      )}
    </div>
  );
}

function SuburbTable({
  heading,
  rows,
  showGrowth,
}: {
  heading: string;
  rows: SuburbMarketRow[];
  showGrowth?: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h3 className="text-2xl text-ink mb-4 leading-tight">
        {heading}
      </h3>
      <div className="tone-light overflow-x-auto rounded-xl border border-line bg-surface-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-warm border-b border-line">
              <th className="px-4 py-3 text-left text-[13px] font-sans font-medium text-ink w-10">#</th>
              <th className="px-4 py-3 text-left text-[13px] font-sans font-medium text-ink">Suburb</th>
              <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">Median price</th>
              {showGrowth && (
                <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">Annual growth</th>
              )}
              <th className="px-4 py-3 text-right text-[13px] font-sans font-medium text-ink">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr
                key={row.slug}
                className="hover:bg-surface-warm/60 transition-colors"
              >
                <td className="px-4 py-3 font-sans text-ink-subtle">{i + 1}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/suburbs/${row.slug}`}
                    className="font-sans font-medium text-ink hover:text-primary transition-colors"
                  >
                    {row.name}
                  </Link>
                  <span className="text-xs font-sans text-ink-subtle ml-1.5">
                    {row.postcode}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-display text-base text-ink">
                    {row.medianHousePrice > 0
                      ? formatPriceFull(row.medianHousePrice)
                      : "-"}
                  </span>
                </td>
                {showGrowth && (
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-display text-base ${
                        row.annualGrowthHouse > 0
                          ? "text-emerald-700"
                          : row.annualGrowthHouse < 0
                            ? "text-red-700"
                            : "text-ink-subtle"
                      }`}
                    >
                      {row.annualGrowthHouse !== 0
                        ? `${row.annualGrowthHouse > 0 ? "+" : ""}${row.annualGrowthHouse.toFixed(1)}%`
                        : "-"}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/suburbs/${row.slug}`}
                    className="font-sans text-xs font-medium text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors whitespace-nowrap"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function StateMarketReportPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  if (!isValidState(state)) notFound();

  const data = await getStateMarketData(state);
  const upperState = state.toUpperCase();
  const stateName = getStateNameForReport(state);
  const reportTitle = `${stateName} Property Market Report ${CURRENT_YEAR}`;
  const reportDescription = `${stateName} property market data for ${CURRENT_YEAR}: median prices, the most affordable and highest-priced suburbs, and where each figure comes from.`;

  const housePrice = data.avgMedianHousePrice ? formatPrice(data.avgMedianHousePrice) : "N/A";
  const unitPrice = data.avgMedianUnitPrice ? formatPrice(data.avgMedianUnitPrice) : "N/A";
  // A tile is drawn only for a figure there is: no feed measures a 12-month
  // change outside NSW and SA, and none measures days on market.
  const growth = data.avgAnnualGrowth != null ? `${data.avgAnnualGrowth > 0 ? "+" : ""}${data.avgAnnualGrowth}%` : null;
  const priced = data.totalSuburbsWithData.toLocaleString("en-AU");
  const commentary = STATE_COMMENTARY[upperState];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Market Reports", url: "/market-reports" },
          { name: data.stateName, url: `/market-reports/${state}` },
        ]}
      />
      <GuideArticleJsonLd
        title={reportTitle}
        description={reportDescription}
        url={`/market-reports/${state}`}
        datePublished="2026-01-01"
      />

      <PhotoHero
        photo="street"
        breadcrumbs={[
          { label: "Market Reports", href: "/market-reports" },
          { label: data.stateName },
        ]}
      >
        <p className="text-sm text-ink-muted mb-5">
          {CURRENT_YEAR} &middot; {priced} suburbs with a published median
        </p>
        <HeroTitle>
          {data.stateName} property market, <span>{CURRENT_YEAR}</span>
        </HeroTitle>
        <HeroLead>
          Median prices and the state&rsquo;s most affordable and
          highest-priced suburbs, from the figures each suburb&rsquo;s own
          page publishes.
        </HeroLead>
      </PhotoHero>

      {/* Stat anchor row */}
      <Band spacing="compact">
        <div className={`grid grid-cols-2 ${growth ? "lg:grid-cols-3" : ""} gap-4`}>
          <StatCard
            icon={<Home className="w-4 h-4" />}
            label="Avg median house"
            value={housePrice}
            sub={`across ${priced} suburbs`}
          />
          <StatCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Avg median unit"
            value={unitPrice}
            sub="where a unit median is published"
          />
          {growth && (
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Avg annual growth"
              value={growth}
              sub="house prices, last 12 months"
            />
          )}
        </div>
        <p className="mt-6 max-w-3xl text-sm text-ink-subtle leading-relaxed">
          {priceSourceLine(upperState)}
        </p>
      </Band>

      {/* State commentary */}
      {commentary && (
        <Band tone="dark" spacing="compact">
          <section className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-sm text-ink-subtle mb-3">
                State of the market
              </p>
              <h2 className="text-3xl sm:text-4xl leading-[1.1] tracking-[-0.025em] text-ink mb-6">
                {data.stateName} in {CURRENT_YEAR}
              </h2>
              <div className="prose-ypg prose-ypg-tight">
                <p>{commentary.marketContext}</p>
              </div>
            </div>
            <aside className="lg:col-span-5 space-y-8">
              <div className="border-t-2 border-ink pt-5">
                <p className="text-sm text-ink-subtle mb-2">
                  Buyer tip, {upperState}
                </p>
                <p className="text-base text-ink leading-relaxed">
                  {commentary.buyerTip}
                </p>
              </div>
              <div className="border-t-2 border-ink pt-5">
                <p className="text-sm text-ink-subtle mb-2">
                  Watch out, {upperState}
                </p>
                <p className="text-base text-ink leading-relaxed">
                  {commentary.watchOut}
                </p>
              </div>
            </aside>
          </section>
        </Band>
      )}

      {/* Tables */}
      <Band tone="quiet" spacing="compact">
        <div className="space-y-14">
          <SuburbTable
            heading={`Top ${data.topByGrowth.length} ${data.stateName} suburbs by annual growth`}
            rows={data.topByGrowth}
            showGrowth
          />
          <SuburbTable
            heading={`${data.stateName}'s most affordable suburbs`}
            rows={data.topMostAffordable}
            showGrowth
          />
          <SuburbTable
            heading={`${data.stateName}'s highest median prices`}
            rows={data.topByMedianPrice}
          />
        </div>
      </Band>

      <Band spacing="compact">
        {/* Cross-link to other state reports */}
        <section>
          <p className="text-sm text-ink-subtle mb-3">
            Other state reports
          </p>
          <div className="flex flex-wrap gap-2">
            {STATE_SLUGS.filter((s) => s !== state).map((s) => (
              <Link
                key={s}
                href={`/market-reports/${s}`}
                className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink hover:border-ink transition-colors"
              >
                {getStateNameForReport(s)}
              </Link>
            ))}
          </div>
        </section>

        {/* Source note */}
        <section className="mt-10 max-w-3xl border-t border-line pt-6 text-sm text-ink-muted">
          <p className="text-sm font-semibold text-ink mb-2">
            Data source
          </p>
          <p className="leading-relaxed">
            {priceSourceLine(upperState)} A suburb is listed only when its
            own page publishes the median, so the tables are shorter than the
            state. Averages are of suburb medians, not of sales.{" "}
            <Link
              href="/methodology#median-prices"
              className="font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
            >
              Full methodology →
            </Link>
          </p>
        </section>
      </Band>

      {/* CTA strip */}
      <Band tone="dark" spacing="compact">
        <section className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-sm text-ink-subtle mb-3">
              Ready to act on the data?
            </p>
            <h3 className="text-3xl sm:text-4xl leading-[1.1] tracking-[-0.025em] text-ink">
              Buying in {data.stateName}?
            </h3>
            <p className="mt-4 text-lg text-ink-muted leading-relaxed">
              Budget, schemes, inspections and offers, step by step.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            {/* The buyer hub; the /buy listings were retired on 14 Oct 2026
                (docs/portal-consolidation-2026-10-14.md). */}
            <Link
              href="/buying"
              className={BUTTON_PRIMARY}
            >
              Buying: where to start
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={stateRankingLink(upperState).href}
              className={BUTTON_SECONDARY}
            >
              {stateRankingLink(upperState).label}
            </Link>
          </div>
        </section>
      </Band>

      {/* Seller funnel exit. Readers of a state market report are gauging
          whether it's a good time to sell — route them into the guide. */}
      <ExpertCTA
        headline={`Thinking about selling in ${data.stateName}?`}
        body="The complete guide to selling in today's market: what it really costs, how agents price your home, the 10 questions that catch bad agents out, and a 12-week plan to settlement. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free selling guide"
        href="/selling-guide"
      />
    </>
  );
}
