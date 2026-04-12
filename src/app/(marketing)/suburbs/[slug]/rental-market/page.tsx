import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, TrendingUp, ArrowLeft, BarChart3 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { DataFreshnessNote } from "@/components/suburb";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getSuburbRentalHistory } from "@/lib/services/rental-service";
import { formatPriceFull, formatPrice } from "@/lib/utils/format";
import { SITE_URL } from "@/lib/constants";

interface RentalMarketPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RentalMarketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };

  const title = `${suburb.name} Rental Market | Rent Prices & Trends | Your Property Guide`;
  const description = `View rental price trends and history for ${suburb.name}, ${suburb.state}. Compare weekly rent for houses, units, and bedrooms.`;
  const canonical = `${SITE_URL}/suburbs/${slug}/rental-market`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

function StatCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value ?? "–"}</p>
    </div>
  );
}

export default async function SuburbRentalMarketPage({ params }: RentalMarketPageProps) {
  const { slug } = await params;

  const [suburb, history] = await Promise.all([
    getSuburbBySlug(slug),
    getSuburbRentalHistory(slug),
  ]);

  if (!suburb) notFound();

  const latest = history[0] ?? null;

  // Gross rental yield from current suburb data
  const currentRent = latest?.medianRentHouse ?? suburb.stats.medianRentHouse;
  const grossYield =
    currentRent > 0 && suburb.stats.medianHousePrice > 0
      ? ((currentRent * 52.0) / suburb.stats.medianHousePrice * 100).toFixed(2)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Rental Market", url: `/suburbs/${slug}/rental-market` },
        ]}
      />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Suburbs", href: "/suburbs" },
              { label: suburb.name, href: `/suburbs/${slug}` },
              { label: "Rental Market" },
            ]}
          />
          <div className="flex items-center gap-3 mt-2">
            <BarChart3 className="w-6 h-6 text-primary shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {suburb.name} Rental Market
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            Rental price trends and history for {suburb.name}, {suburb.state} {suburb.postcode}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {history.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No rental data available</p>
            <p className="text-sm text-gray-400 mt-1">
              Rental statistics for {suburb.name} have not yet been loaded.
            </p>
          </div>
        ) : (
          <>
            {/* Current rent summary */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Current Rent Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard
                  label="House (median)"
                  value={latest?.medianRentHouse != null ? `$${latest.medianRentHouse}/wk` : null}
                />
                <StatCard
                  label="Unit (median)"
                  value={latest?.medianRentUnit != null ? `$${latest.medianRentUnit}/wk` : null}
                />
                <StatCard
                  label="3 Bedroom"
                  value={latest?.medianRent3Bed != null ? `$${latest.medianRent3Bed}/wk` : null}
                />
                <StatCard
                  label="2 Bedroom"
                  value={latest?.medianRent2Bed != null ? `$${latest.medianRent2Bed}/wk` : null}
                />
                <StatCard
                  label="1 Bedroom"
                  value={latest?.medianRent1Bed != null ? `$${latest.medianRent1Bed}/wk` : null}
                />
              </div>
              <DataFreshnessNote
                label="Rental"
                asOf={latest?.periodDate ?? null}
                source={latest?.source ?? undefined}
              />
            </section>

            {/* Rental history table */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rental History</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Period</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">House Median</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit Median</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">3 Bed</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">2 Bed</th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Bond Lodgements</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">{row.period}</td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-700">
                            {row.medianRentHouse != null ? `$${row.medianRentHouse}/wk` : "–"}
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-700">
                            {row.medianRentUnit != null ? `$${row.medianRentUnit}/wk` : "–"}
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-600 hidden sm:table-cell">
                            {row.medianRent3Bed != null ? `$${row.medianRent3Bed}/wk` : "–"}
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-600 hidden sm:table-cell">
                            {row.medianRent2Bed != null ? `$${row.medianRent2Bed}/wk` : "–"}
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-600 hidden md:table-cell">
                            {row.bondLodgements != null ? row.bondLodgements.toLocaleString() : "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Compare with purchase */}
            {grossYield && suburb.stats.medianHousePrice > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Rental Yield vs Purchase Price
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Home className="w-4 h-4" />
                        <span className="text-sm">Median House Price</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPriceFull(suburb.stats.medianHousePrice)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-500">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Median Weekly Rent</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${currentRent}/wk
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Gross Rental Yield</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        {grossYield}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Gross yield = (weekly rent × 52) ÷ median house price × 100. Does not account for expenses, vacancy, or management fees.
                  </p>
                </div>
              </section>
            )}

            {/* CTA: rent listings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Properties for Rent in {suburb.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Browse active rental listings in {suburb.name}.
                </p>
              </div>
              <Link
                href={`/suburbs/${slug}/rent`}
                className="shrink-0 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-primary/90 transition-colors"
              >
                View Rental Properties →
              </Link>
            </div>
          </>
        )}

        {/* Back link */}
        <div>
          <Link
            href={`/suburbs/${slug}`}
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {suburb.name} suburb profile
          </Link>
        </div>
      </div>
    </div>
  );
}
