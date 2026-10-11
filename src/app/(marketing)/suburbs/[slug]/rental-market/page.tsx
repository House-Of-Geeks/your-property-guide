import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { SuburbSubrouteHeader, getSuburbListingTabs, DataFreshnessNote } from "@/components/suburb";
import { ExpertCTA } from "@/components/journey";
import { BreadcrumbJsonLd, PlaceJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getSuburbSubpageAvailability } from "@/lib/services/subpage-availability";
import { getSuburbRentalHistory } from "@/lib/services/rental-service";
import { countProperties } from "@/lib/services/property-service";
import { buildAllDwellingsMarket, buildRentalMarket } from "@/lib/rental-market";
import { isRentalMarketPilot } from "@/lib/data/rental-market-pilot";
import { RentalMarketSections } from "@/components/suburb/RentalMarketSections";
import { RentalMarketLandlordSections } from "@/components/suburb/RentalMarketLandlordSections";
import { RentalMarketAllDwellings } from "@/components/suburb/RentalMarketAllDwellings";
import { buildLandlordModel } from "@/lib/rental-landlord";
import { Faq } from "@/components/guide/Faq";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { canonicalSuburbSlug } from "@/lib/duplicate-localities";
import { quarterSpan, rentalSourceLabel } from "@/lib/rental-labels";
import { salesProvenanceFor } from "@/lib/suburb-snapshot";

interface RentalMarketPageProps {
  params: Promise<{ slug: string }>;
}

// 7d ISR, same as the suburb profile and its other sub-pages. Without these
// exports this route rendered from the database on every request
// (cache-control: private, no-store) — 1,513 sitemap URLs, plus the tab
// links from every profile, hit by crawlers thousands of times a day. That
// was a large part of the crawl-burst connection exhaustion in July 2026
// (fix item 4a). Stats refresh via the quarterly sync, which now revalidates
// changed suburbs' paths on demand (scripts/sync/revalidate-paths.ts).
export const revalidate = 604800;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: RentalMarketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [suburb, history] = await Promise.all([getSuburbBySlug(slug), getSuburbRentalHistory(slug)]);
  if (!suburb) return { title: "Suburb Not Found" };

  let title = `${suburb.name} Rental Market | Rent Prices & Trends`;
  let description = `View rental price trends and history for ${suburb.name}, ${suburb.state}. Compare weekly rent for houses, units, and bedrooms.`;
  if (isRentalMarketPilot(slug)) {
    // Pilot pages: the title names only the sections that will render.
    const listings = await countProperties({ listingType: "rent", suburb: slug });
    const model = buildRentalMarket(suburb, history, listings);
    title = model.title;
    description = model.description;
  } else {
    // WA bond data: one median across all dwellings, so the description
    // promises that figure, not house, unit and bedroom rents it lacks.
    const all = buildAllDwellingsMarket(suburb, history);
    if (all) description = all.description;
  }
  // A secondary postcode row (the same locality under a second postcode)
  // canonicalises to the primary row's rental-market page, as its profile
  // does (src/lib/duplicate-localities.ts). No redirect.
  const canonical = `${SITE_URL}/suburbs/${canonicalSuburbSlug(slug)}/rental-market`;

  return {
    title,
    description,
    alternates: { canonical },
    // A page with no rental row renders "No rental data available yet": keep
    // it out of the index (and the sitemap, see subpages/sitemap.ts).
    robots: history.length === 0 ? { index: false, follow: true } : undefined,
    // og titles don't get the root title.template — brand them explicitly
    openGraph: { url: canonical, title: `${title} | ${SITE_NAME}`, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

/** "$1,600/wk": thousands separated, as the rest of the site prints money. */
const wk = (n: number) => `$${n.toLocaleString("en-AU")}/wk`;

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

  // Fix item 13 pilot: 50 Victorian suburbs get the rebuilt page; the rest
  // keep the markup below until the pilot has been checked.
  const pilot = isRentalMarketPilot(slug);
  const model = pilot ? buildRentalMarket(suburb, history, await countProperties({ listingType: "rent", suburb: slug })) : null;
  // WA: the newest row is an all-dwellings median (rental-wa). Its own view,
  // with no house, unit or bedroom cards and no yield.
  const all = model?.current ? null : buildAllDwellingsMarket(suburb, history);

  // Tabs and rent links only where the pages behind them have something on them.
  const availability = await getSuburbSubpageAvailability(suburb);

  // Landlord blocks on every rental-market page, with or without rental
  // data (commercial intent review 30 Sep 2026, section 3.1): "rental
  // appraisal {suburb}" and "property managers {suburb}" searches land here.
  // Pure, from data already fetched; the page's noindex rule above and the
  // sitemap gate (subpages/sitemap.ts) are unchanged by it.
  const landlord = buildLandlordModel(suburb, history);

  const latest = history[0] ?? null;
  // The feed's name, not its code ("NSW rental bond data (postcode 2530)",
  // not "rental-nsw"); null for a feed the site can't name.
  const latestLabel = rentalSourceLabel(latest?.source, suburb.postcode);
  // The yield block's rent comes only from the newest row of a named feed.
  // No fallback to the Suburb row's rent, which can be a seed or census
  // proxy value (commercial-intent review, 10 Oct 2026, renting 0.8).
  const currentRent = latestLabel && latest?.medianRentHouse ? latest.medianRentHouse : 0;
  // The house median is already gated by publishedSales; it is printed only
  // with its provenance (sample, source and period).
  const priceProvenance = salesProvenanceFor(suburb);
  const grossYield =
    currentRent > 0 && suburb.stats.medianHousePrice > 0 && priceProvenance
      ? ((currentRent * 52.0) / suburb.stats.medianHousePrice * 100).toFixed(2)
      : null;
  // Article dateModified: the newest rental row, never before datePublished.
  const DATE_PUBLISHED = "2025-01-01";
  const newestRow = latest?.periodDate ? new Date(latest.periodDate).toISOString().slice(0, 10) : null;
  const dateModified = newestRow && newestRow > DATE_PUBLISHED ? newestRow : DATE_PUBLISHED;

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
        title={model?.title ?? `${suburb.name} rental market: rent prices and trends`}
        description={model?.description ?? all?.description ?? `View rental price trends and history for ${suburb.name}, ${suburb.state}. Compare weekly rent for houses, units, and bedrooms.`}
        url={`/suburbs/${slug}/rental-market`}
        datePublished={DATE_PUBLISHED}
        dateModified={dateModified}
      />

      <SuburbSubrouteHeader
        suburb={suburb}
        eyebrow="Rental market in"
        title={<>{suburb.name} <span className="italic text-primary">rental market</span></>}
        subtitle={model?.current ? `Median rent, yield and what is listed now in ${suburb.name}, ${suburb.state} ${suburb.postcode}, from ${model.provenance}.` : all ? all.subtitle : `Median rent, history and gross-yield calculations for ${suburb.name}, ${suburb.state} ${suburb.postcode}.`}
        breadcrumbLeaf="Rental Market"
        tabs={getSuburbListingTabs(slug, "rental-market", availability)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {model?.current ? (
          <RentalMarketSections suburb={suburb} slug={slug} model={model} landlord={landlord} />
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface-raised p-12 text-center">
            <BarChart3 className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <p className="font-display text-xl text-ink">No rental data available yet</p>
            <p className="font-sans text-sm text-ink-muted mt-2 max-w-md mx-auto">
              Rental statistics for {suburb.name} have not yet been loaded into the database.
              Check back soon
              {availability.rent && (
                <>
                  , or{" "}
                  <Link href={`/suburbs/${slug}/rent`} className="underline hover:text-primary">
                    browse current rental listings
                  </Link>
                </>
              )}
              .
            </p>
          </div>
        ) : all ? (
          <RentalMarketAllDwellings name={suburb.name} slug={slug} all={all} rentListings={availability.rent} />
        ) : (
          <>
            {/* Current rent summary */}
            <section>
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-3">
                Current rent
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight mb-6">
                The latest published rents in {suburb.name}.
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <MetricCard label="House (median)" value={latest?.medianRentHouse != null ? wk(latest.medianRentHouse) : null} />
                <MetricCard label="Unit (median)"  value={latest?.medianRentUnit  != null ? wk(latest.medianRentUnit)  : null} />
                <MetricCard label="3 bedroom"       value={latest?.medianRent3Bed  != null ? wk(latest.medianRent3Bed)  : null} />
                <MetricCard label="2 bedroom"       value={latest?.medianRent2Bed  != null ? wk(latest.medianRent2Bed)  : null} />
                <MetricCard label="1 bedroom"       value={latest?.medianRent1Bed  != null ? wk(latest.medianRent1Bed)  : null} />
              </div>
              <DataFreshnessNote
                label="Rental"
                asOf={latest?.periodDate ?? null}
                source={latestLabel ?? undefined}
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
                    {priceProvenance && (
                      <p className="font-sans text-xs text-ink-subtle mt-2">{priceProvenance.short}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-ink-muted text-sm mb-2">
                      <BarChart3 className="w-4 h-4 text-cta" />
                      Median weekly rent
                    </div>
                    <p className="font-display text-3xl text-ink leading-none">
                      {wk(currentRent)}
                    </p>
                    {latestLabel && latest && (
                      <p className="font-sans text-xs text-ink-subtle mt-2">{`${latestLabel}, ${latest.period}`}</p>
                    )}
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
                          <td className="py-4 px-5 font-medium text-ink">{quarterSpan(row.period)}</td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted">
                            {row.medianRentHouse != null ? wk(row.medianRentHouse) : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted">
                            {row.medianRentUnit != null ? wk(row.medianRentUnit) : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">
                            {row.medianRent3Bed != null ? wk(row.medianRent3Bed) : "–"}
                          </td>
                          <td className="py-4 px-5 text-right tabular-nums text-ink-muted hidden sm:table-cell">
                            {row.medianRent2Bed != null ? wk(row.medianRent2Bed) : "–"}
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

            {/* CTA, soft: only when there are rentals listed to browse */}
            {availability.rent && (
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
            )}
          </>
        )}

        {!model?.current && (
          <>
            <RentalMarketLandlordSections suburb={suburb} landlord={landlord} />
            <Faq items={landlord.faqs} title={`Renting and investing in ${suburb.name}`} />
          </>
        )}
      </div>

      {/* Readers here carry investor/landlord intent, so the selling- and
          buying-guide funnels are the wrong offer. Deep-link the
          expert-match form with the investing intent pre-answered. */}
      <ExpertCTA
        headline={`Thinking about investing in ${suburb.name}?`}
        body={`Gross yield is only half the picture. Get matched with a local expert who knows vacancy, tenant demand and what actually rents in ${suburb.name}. Free, no obligation.`}
        ctaLabel="Talk to an investment expert"
        href="/find-an-expert?intent=investing#match"
      />
    </>
  );
}
