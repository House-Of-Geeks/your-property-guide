import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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

const STATE_SLUGS = ["qld", "nsw", "vic", "wa", "sa", "tas", "nt", "act"] as const;
type StateSlug = (typeof STATE_SLUGS)[number];

const CURRENT_YEAR = 2026;

function isValidState(slug: string): slug is StateSlug {
  return (STATE_SLUGS as readonly string[]).includes(slug);
}

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
  const description = `${stateName} property market data for ${CURRENT_YEAR} — median prices, annual growth, top suburbs and affordability rankings.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/market-reports/${state}` },
    openGraph: {
      url: `${SITE_URL}/market-reports/${state}`,
      title,
      description,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary">{icon}</div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{heading}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Suburb</th>
              <th className="px-4 py-3 text-right">Median Price</th>
              {showGrowth && (
                <th className="px-4 py-3 text-right">Annual Growth</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.slug} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/suburbs/${row.slug}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.name}
                  </Link>
                  <span className="text-gray-400 text-xs ml-1">{row.postcode}</span>
                </td>
                <td className="px-4 py-3 text-right text-gray-900 font-medium">
                  {row.medianHousePrice > 0
                    ? formatPriceFull(row.medianHousePrice)
                    : "—"}
                </td>
                {showGrowth && (
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        row.annualGrowthHouse > 0
                          ? "text-green-700 font-medium"
                          : row.annualGrowthHouse < 0
                          ? "text-red-600 font-medium"
                          : "text-gray-400"
                      }
                    >
                      {row.annualGrowthHouse !== 0
                        ? `${row.annualGrowthHouse > 0 ? "+" : ""}${row.annualGrowthHouse.toFixed(1)}%`
                        : "—"}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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

  const stateName = getStateNameForReport(state);
  const reportTitle = `${stateName} Property Market Report ${CURRENT_YEAR}`;
  const reportDescription = `${stateName} property market data for ${CURRENT_YEAR} — median prices, annual growth, top suburbs and affordability rankings.`;

  const housePrice = data.avgMedianHousePrice
    ? formatPrice(data.avgMedianHousePrice)
    : "N/A";
  const unitPrice = data.avgMedianUnitPrice
    ? formatPrice(data.avgMedianUnitPrice)
    : "N/A";
  const growth = data.avgAnnualGrowth != null ? `${data.avgAnnualGrowth}%` : "N/A";
  const dom = data.avgDaysOnMarket != null ? `${data.avgDaysOnMarket} days` : "N/A";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Market Reports", url: "/market-reports" },
          { name: data.stateName, url: `/market-reports/${state}` },
        ]}
      />
      <GuideArticleJsonLd
        title={reportTitle}
        description={reportDescription}
        url={"/market-reports/" + state}
        datePublished="2026-01-01"
      />
      <Breadcrumbs
        items={[
          { label: "Market Reports", href: "/market-reports" },
          { label: data.stateName },
        ]}
      />

      {/* Hero */}
      <div className="gradient-brand rounded-2xl p-8 text-white mb-8">
        <p className="text-sm opacity-80 mb-1">Property Market Report</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">{data.stateName}</h1>
        <p className="text-base opacity-90 mb-4">Q1 {CURRENT_YEAR}</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="opacity-70">Avg Median House Price</p>
            <p className="text-2xl font-bold">{housePrice}</p>
          </div>
          <div>
            <p className="opacity-70">Avg Annual Growth</p>
            <p className="text-2xl font-bold">{growth}</p>
          </div>
          <div>
            <p className="opacity-70">Suburbs Tracked</p>
            <p className="text-2xl font-bold">{data.totalSuburbsWithData.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Home className="w-5 h-5" />}
          label="Avg Median House Price"
          value={housePrice}
          sub="across tracked suburbs"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Avg Median Unit Price"
          value={unitPrice}
          sub="across tracked suburbs"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Annual Growth"
          value={growth}
          sub="house price growth"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Avg Days on Market"
          value={dom}
          sub="time to sell"
        />
      </div>

      {/* Tables */}
      <div className="space-y-6 mb-8">
        <SuburbTable
          heading="Top 10 Suburbs by Annual Growth"
          rows={data.topByGrowth}
          showGrowth
        />
        <SuburbTable
          heading="Top 10 Most Affordable Suburbs"
          rows={data.topMostAffordable}
          showGrowth
        />
        <SuburbTable
          heading="Top 10 Highest Median Price Suburbs"
          rows={data.topByMedianPrice}
          showGrowth={false}
        />
      </div>

      {/* Data note */}
      <p className="text-xs text-gray-400 mb-6">
        Market data sourced from state revenue offices and property sales data. Updated quarterly.
        Median prices and growth figures are calculated from available suburb-level data and may
        not reflect the full market.
      </p>

      {/* CTA */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">Search properties for sale in {data.stateName}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse listings across all suburbs in {data.stateName}
          </p>
        </div>
        <Link
          href={`/buy?state=${state}`}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          Browse {data.stateName} listings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
