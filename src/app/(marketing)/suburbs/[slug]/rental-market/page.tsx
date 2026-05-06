import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { SuburbSubrouteHeader, getSuburbListingTabs, DataFreshnessNote } from "@/components/suburb";
import { BreadcrumbJsonLd, PlaceJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getSuburbRentalHistory } from "@/lib/services/rental-service";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface RentalMarketPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RentalMarketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return { title: "Suburb Not Found" };

  const title = `${suburb.name} Rental Market | Rent Prices & Trends | ${SITE_NAME}`;
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

function MetricCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-4 shadow-card">
      <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">{label}</p>
      <p className="font-display text-2xl text-ink leading-none">{value ?? "–"}</p>
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
  const currentRent = latest?.medianRentHouse ?? suburb.stats.medianRentHouse;
  const grossYield =
    currentRent > 0 && suburb.stats.medianHousePrice > 0
      ? ((currentRent * 52.0) / suburb.stats.medianHousePrice * 100).toFixed(2)
      : null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Suburbs", url: "/suburbs" },
          { name: suburb.name, url: `/suburbs/${slug}` },
          { name: "Rental Market", url: `/suburbs/${slug}/rental-market` },
        ]}
      />
      <PlaceJsonLd
        name={suburb.name}
        url={`/suburbs/${suburb.slug}`}
        addressLocality={suburb.name}
        addressRegion={suburb.state}
        postalCode={suburb.postcode}
      />
      <GuideArticleJsonLd
        title={`${suburb.name} Rental Market | Rent Prices & Trends | ${SITE_NAME}`}
        description={`View rental price trends and history for ${suburb.name}, ${suburb.state}. Compare weekly rent for houses, units, and bedrooms.`}
        url={`/suburbs/${slug}/rental-market`}
        datePublished="2025-01-01"
      />

      <SuburbSubrouteHeader
        suburb={suburb}
        eyebrow="Rental market in"
        title={<>The <span className="italic text-primary">rental market</span></>}
        subtitle={`Median rent, history and gross-yield calculations for ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="Rental Market"
        tabs={getSuburbListingTabs(slug, "rental-market")}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface-raised p-12 text-center">
            <BarChart3 className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <p className="font-display text-xl text-ink">No rental data available yet</p>
            <p className="font-sans text-sm text-ink-muted mt-2 max-w-md mx-auto">
              Rental statistics for {suburb.name} have not yet been loaded into the database.
              Check back soon, or{" "}
              <Link href={`/suburbs/${slug}/rent`} className="underline hover:text-primary">
                browse current rental listings
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            {/* Current rent summary */}
            <section>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Current rent
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
                What it costs to rent here right now.
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <MetricCard label="House (median)" value={latest?.medianRentHouse != null ? `$${latest.medianRentHouse}/wk` : null} />
                <MetricCard label="Unit (median)"  value={latest?.medianRentUnit  != null ? `$${latest.medianRentUnit}/wk`  : null} />
                <MetricCard label="3 bedroom"       value={latest?.medianRent3Bed  != null ? `$${latest.medianRent3Bed}/wk`  : null} />
                <MetricCard label="2 bedroom"       value={latest?.medianRent2Bed  != null ? `$${latest.medianRent2Bed}/wk`  : null} />
                <MetricCard label="1 bedroom"       value={latest?.medianRent1Bed  != null ? `$${latest.medianRent1Bed}/wk`  : null} />
              </div>
              <DataFreshnessNote
                label="Rental"
                asOf={latest?.periodDate ?? null}
                source={latest?.source ?? undefined}
              />
            </section>

            {/* Yield vs price */}
            {grossYield && suburb.stats.medianHousePrice > 0 && (
              <section className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                  Investor view
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-ink leading-tight tracking-tight mb-6">
                  Rental yield versus purchase price.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-ink-muted text-sm mb-2">
                      <Home className="w-4 h-4 text-cta" />
                      Median house price
                    </div>
                    <p className="font-display text-3xl text-ink leading-none">
                      {formatPriceFull(suburb.stats.medianHousePrice)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-ink-muted text-sm mb-2">
                      <BarChart3 className="w-4 h-4 text-cta" />
                      Median weekly rent
                    </div>
                    <p className="font-display text-3xl text-ink leading-none">
                      ${currentRent}/wk
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-ink-muted text-sm mb-2">
                      <TrendingUp className="w-4 h-4 text-cta" />
                      Gross rental yield
                    </div>
                    <p className="font-display text-3xl text-success leading-none">
                      {grossYield}%
                    </p>
                  </div>
                </div>
                <p className="font-sans text-xs text-ink-subtle mt-6">
                  Gross yield = (weekly rent × 52) ÷ median house price × 100. Does not account for
                  expenses, vacancy, or management fees. Use the{" "}
                  <Link href="/rental-yield-calculator" className="underline hover:text-primary">
                    rental yield calculator
                  </Link>{" "}
                  for a net-yield estimate.
                </p>
              </section>
            )}

            {/* Rental history table */}
            <section>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                History
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
                How rents have moved.
              </h2>
              <div className="rounded-2xl border border-line bg-surface-raised overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-warm border-b border-line-warm">
                        <th className="py-4 px-5 text-left text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Period</th>
                        <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">House median</th>
                        <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider">Unit median</th>
                        <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">3 bed</th>
                        <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden sm:table-cell">2 bed</th>
                        <th className="py-4 px-5 text-right text-xs font-sans font-semibold text-ink-subtle uppercase tracking-wider hidden md:table-cell">Bond lodgements</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row) => (
                        <tr key={row.id} className="border-b border-line last:border-0 hover:bg-surface-sunken transition-colors">
                          <td className="py-4 px-5 font-medium text-ink">{row.period}</td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted">
                            {row.medianRentHouse != null ? `$${row.medianRentHouse}/wk` : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted">
                            {row.medianRentUnit != null ? `$${row.medianRentUnit}/wk` : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">
                            {row.medianRent3Bed != null ? `$${row.medianRent3Bed}/wk` : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">
                            {row.medianRent2Bed != null ? `$${row.medianRent2Bed}/wk` : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden md:table-cell">
                            {row.bondLodgements != null ? row.bondLodgements.toLocaleString() : "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* CTA, soft */}
            <div className="rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
                  Active listings
                </p>
                <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight">
                  Properties for rent in {suburb.name}.
                </h3>
                <p className="font-sans text-sm text-ink-muted mt-2">
                  Browse current rental listings.
                </p>
              </div>
              <Link
                href={`/suburbs/${slug}/rent`}
                className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-raised text-ink hover:border-ink font-medium px-5 py-2.5 transition-colors"
              >
                View rentals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
