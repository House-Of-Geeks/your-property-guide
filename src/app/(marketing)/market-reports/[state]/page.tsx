import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Home, DollarSign, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import {
  getStateMarketData,
  getStateNameForReport,
  type SuburbMarketRow,
} from "@/lib/services/market-report-service";
import { formatPrice, formatPriceFull } from "@/lib/utils/format";
import { STATE_COMMENTARY } from "@/lib/data/state-commentary";

const STATE_SLUGS = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"] as const;
type StateSlug = (typeof STATE_SLUGS)[number];

const CURRENT_YEAR = 2026;

function isValidState(slug: string): slug is StateSlug {
  return (STATE_SLUGS as readonly string[]).includes(slug);
}

export const revalidate = 86400; // cache as ISR for 24h, regen on demand

export function generateStaticParams() {
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
  const title = `${stateName} Property Market Report ${CURRENT_YEAR} | Your Property Guide`;
  const description = `${stateName} property market data for ${CURRENT_YEAR}, median prices, annual growth, top suburbs and affordability rankings, sourced from state revenue offices.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/market-reports/${state}` },
    openGraph: {
      url: `${SITE_URL}/market-reports/${state}`,
      title,
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
    <div className="rounded-2xl border border-line bg-surface-raised p-6">
      <div className="flex items-center gap-2 mb-3 text-ink-subtle">
        {icon}
        <p className="text-xs font-sans uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="font-display text-3xl text-ink leading-none">{value}</p>
      {sub && (
        <p className="mt-2 text-xs font-sans text-ink-subtle">{sub}</p>
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
      <h3 className="font-display text-2xl text-ink mb-4 leading-tight">
        {heading}
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-warm border-b border-line">
              <th className="px-4 py-3 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-sans font-medium text-ink uppercase tracking-wide">Suburb</th>
              <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Median price</th>
              {showGrowth && (
                <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Annual growth</th>
              )}
              <th className="px-4 py-3 text-right text-xs font-sans font-medium text-ink uppercase tracking-wide">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, i) => (
              <tr
                key={row.slug}
                className="hover:bg-surface-warm/60 transition-colors"
              >
                <td className="px-4 py-3 font-sans text-ink-subtle tabular-nums">{i + 1}</td>
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
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className="font-display text-base text-ink">
                    {row.medianHousePrice > 0
                      ? formatPriceFull(row.medianHousePrice)
                      : "—"}
                  </span>
                </td>
                {showGrowth && (
                  <td className="px-4 py-3 text-right tabular-nums">
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
                        : "—"}
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
  const reportDescription = `${stateName} property market data for ${CURRENT_YEAR}, median prices, annual growth, top suburbs and affordability rankings.`;

  const housePrice = data.avgMedianHousePrice ? formatPrice(data.avgMedianHousePrice) : "N/A";
  const unitPrice = data.avgMedianUnitPrice ? formatPrice(data.avgMedianUnitPrice) : "N/A";
  const growth = data.avgAnnualGrowth != null ? `${data.avgAnnualGrowth}%` : "N/A";
  const dom = data.avgDaysOnMarket != null ? `${data.avgDaysOnMarket} days` : "N/A";
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

      {/* Editorial hero */}
      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Market Reports", href: "/market-reports" },
                { label: data.stateName },
              ]}
            />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            Q1 {CURRENT_YEAR} &middot; {data.totalSuburbsWithData.toLocaleString()} suburbs tracked
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {data.stateName} property market, <span className="italic text-primary">{CURRENT_YEAR}</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Median prices, annual growth, days on market, and the state&rsquo;s
            top suburbs by growth, affordability and price, sourced from
            state revenue offices.
          </p>
        </div>
      </section>

      {/* Stat anchor row */}
      <section className="bg-surface-raised border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Home className="w-4 h-4" />}
              label="Avg median house"
              value={housePrice}
              sub="across tracked suburbs"
            />
            <StatCard
              icon={<DollarSign className="w-4 h-4" />}
              label="Avg median unit"
              value={unitPrice}
              sub="across tracked suburbs"
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Avg annual growth"
              value={growth}
              sub="house prices, last 12 months"
            />
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              label="Avg days on market"
              value={dom}
              sub="time to sell"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* State commentary */}
        {commentary && (
          <section className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                State of the market
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-4">
                {data.stateName} in {CURRENT_YEAR}.
              </h2>
              <div className="prose-ypg prose-ypg-tight">
                <p>{commentary.marketContext}</p>
              </div>
            </div>
            <aside className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-line bg-surface-warm p-5">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                  Buyer tip — {upperState}
                </p>
                <p className="font-sans text-sm text-ink leading-relaxed">
                  {commentary.buyerTip}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-warm p-5">
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                  Watch out — {upperState}
                </p>
                <p className="font-sans text-sm text-ink leading-relaxed">
                  {commentary.watchOut}
                </p>
              </div>
            </aside>
          </section>
        )}

        {/* Tables */}
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

        {/* Cross-link to other state reports */}
        <section className="rounded-2xl border border-line bg-surface-warm p-6">
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
            Other state reports
          </p>
          <div className="flex flex-wrap gap-2">
            {STATE_SLUGS.filter((s) => s !== state).map((s) => (
              <Link
                key={s}
                href={`/market-reports/${s}`}
                className="inline-flex items-center rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-sm font-sans font-medium text-ink hover:border-primary/40 hover:text-primary transition-colors"
              >
                {getStateNameForReport(s)}
              </Link>
            ))}
          </div>
        </section>

        {/* Source note */}
        <section className="rounded-2xl border border-line bg-surface-warm p-5 text-sm font-sans text-ink-muted">
          <p className="text-xs uppercase tracking-[0.25em] text-ink-subtle mb-2">
            Data source
          </p>
          <p className="leading-relaxed">
            Market data sourced from state revenue offices and property sales
            records. Updated quarterly. Median prices and growth figures are
            calculated from available suburb-level data and may not reflect the
            full market.{" "}
            <Link
              href="/methodology#median-prices"
              className="text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 transition-colors"
            >
              Full methodology →
            </Link>
          </p>
        </section>

        {/* CTA strip */}
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
              Ready to act on the data?
            </p>
            <h3 className="font-display text-2xl text-ink leading-tight">
              Search {data.stateName} properties for sale.
            </h3>
            <p className="mt-2 font-sans text-sm text-ink-muted">
              Browse listings across all suburbs in {data.stateName}.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={`/buy?state=${state}`}
              className="inline-flex items-center gap-2 bg-cta text-white px-5 py-3 rounded-lg text-sm font-sans font-medium hover:bg-cta-hover transition-colors"
            >
              Browse {upperState} listings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/best-suburbs/highest-growth/${state}`}
              className="inline-flex items-center gap-2 border border-line bg-surface-raised text-ink px-5 py-3 rounded-lg text-sm font-sans font-medium hover:border-primary/40 hover:text-primary transition-colors"
            >
              {upperState} growth ranking
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
