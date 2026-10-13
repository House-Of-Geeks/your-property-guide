import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  SuburbSubrouteHeader,
  SubrouteActionCard,
  SubpageNextSteps,
  getSuburbListingTabs,
  type NextStepGroup,
} from "@/components/suburb";
import { guideFunnelHref } from "@/lib/guide-funnel";
import { BreadcrumbJsonLd, PlaceJsonLd, GuideArticleJsonLd } from "@/components/seo";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { getSuburbSubpageAvailability } from "@/lib/services/subpage-availability";
import { getSuburbRentalHistory } from "@/lib/services/rental-service";
import { getNearbySubpages, type NearbySubpage } from "@/lib/services/nearby-subpages";
import { countProperties } from "@/lib/services/property-service";
import { buildAllDwellingsMarket, buildRentalMarket } from "@/lib/rental-market";
import { isRentalMarketPilot } from "@/lib/data/rental-market-pilot";
import { RentalMarketSections } from "@/components/suburb/RentalMarketSections";
import { RentalMarketLandlordSections } from "@/components/suburb/RentalMarketLandlordSections";
import { RentalMarketAllDwellings } from "@/components/suburb/RentalMarketAllDwellings";
import { buildLandlordModel } from "@/lib/rental-landlord";
import { ALL_DWELLINGS_LABEL, monthYear, rentalSourceLabel } from "@/lib/rental-labels";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import { Faq } from "@/components/guide/Faq";
import { formatPriceFull } from "@/lib/utils/format";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

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
  const canonical = `${SITE_URL}/suburbs/${slug}/rental-market`;

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

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
const positive = (n: number | null | undefined): n is number => typeof n === "number" && n > 0;

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="font-sans text-[13px] text-ink-muted mb-1.5">{label}</p>
      <p className="font-display text-2xl font-bold text-ink leading-none">{value}</p>
    </div>
  );
}

/** "$550 for houses and $298 for units", from whichever is published. */
function houseUnitPhrase(house: number | null, unit: number | null): string | null {
  if (house && unit) return `${money(house)} for houses and ${money(unit)} for units`;
  if (house) return `${money(house)} for houses`;
  if (unit) return `${money(unit)} for units`;
  return null;
}

/**
 * Nearby suburbs' latest rents, each linked to its own rental-market page
 * (commercial intent review 10 Oct 2026, renting page 1: rivals list
 * neighbours, and neighbour names are the terms they carry that we lack).
 */
function NearbyRents({ name, nearby }: { name: string; nearby: NearbySubpage[] }) {
  const rows = nearby.filter((n) => n.rent);
  if (rows.length === 0) return null;
  const anyAll = rows.some((n) => n.rent?.all);
  const anySplit = rows.some((n) => n.rent?.house || n.rent?.unit);
  return (
    <section id="nearby-rents" className="scroll-mt-20">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">Rents in suburbs near {name}</h2>
      <p className="font-sans text-sm text-ink-muted mb-5 max-w-2xl">The latest published median weekly rent in each neighbouring suburb. Each links to its own rental market page.</p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-warm border-b border-line text-left">
              <th scope="col" className="py-3 px-4 font-semibold text-ink">Suburb</th>
              {anySplit && <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">Houses</th>}
              {anySplit && <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">Units</th>}
              {anyAll && <th scope="col" className="py-3 px-4 font-semibold text-ink text-right">{ALL_DWELLINGS_LABEL}</th>}
              <th scope="col" className="py-3 px-4 font-semibold text-ink text-right hidden sm:table-cell">As at</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => {
              const r = n.rent!;
              return (
                <tr key={n.slug} className="border-b border-line last:border-0">
                  <th scope="row" className="py-3 px-4 text-left font-medium">
                    <Link href={`/suburbs/${n.slug}/rental-market`} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                      {n.name}
                    </Link>
                  </th>
                  {anySplit && <td className="py-3 px-4 text-right text-ink">{r.house ? `${money(r.house)}/wk` : "–"}</td>}
                  {anySplit && <td className="py-3 px-4 text-right text-ink">{r.unit ? `${money(r.unit)}/wk` : "–"}</td>}
                  {anyAll && <td className="py-3 px-4 text-right text-ink">{r.all ? `${money(r.all)}/wk` : "–"}</td>}
                  <td className="py-3 px-4 text-right text-ink-muted hidden sm:table-cell whitespace-nowrap">{monthYear(r.periodDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-xs text-ink-subtle mt-3">
        {`Sources: ${[...new Set(rows.map((n) => n.rent!.label))].join("; ")}. Medians of new rentals recorded in the period shown.`}
      </p>
    </section>
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
  const nearby = await getNearbySubpages(suburb.nearbySuburbs);

  // Landlord blocks on every rental-market page, with or without rental
  // data (commercial intent review 30 Sep 2026, section 3.1): "rental
  // appraisal {suburb}" and "property managers {suburb}" searches land here.
  // Pure, from data already fetched; the page's noindex rule above and the
  // sitemap gate (subpages/sitemap.ts) are unchanged by it.
  const landlord = buildLandlordModel(suburb, history);

  const latest = history[0] ?? null;
  // The legacy branch prints the row's own figures only: the Suburb row's
  // rent can be a seed or census proxy (review 10 Oct 2026, renting 0.8).
  const currentRent = latest && positive(latest.medianRentHouse) ? latest.medianRentHouse : 0;
  const grossYield =
    currentRent > 0 && suburb.stats.medianHousePrice > 0
      ? ((currentRent * 52.0) / suburb.stats.medianHousePrice * 100).toFixed(2)
      : null;
  const latestLabel = latest ? rentalSourceLabel(latest.source, suburb.postcode) : null;
  const latestWhen = latest ? monthYear(latest.periodDate) : null;
  const legacyCards = latest
    ? ([
        ["Houses (median)", latest.medianRentHouse],
        ["Units (median)", latest.medianRentUnit],
        ["3 bedroom", latest.medianRent3Bed],
        ["2 bedroom", latest.medianRent2Bed],
        ["1 bedroom", latest.medianRent1Bed],
      ] as const).filter(([, v]) => positive(v))
    : [];
  const legacyColumns = {
    unit: history.some((r) => positive(r.medianRentUnit)),
    bed3: history.some((r) => positive(r.medianRent3Bed)),
    bed2: history.some((r) => positive(r.medianRent2Bed)),
    bonds: history.some((r) => positive(r.bondLodgements)),
  };

  // The answer, first: the figure people searched for, with its source.
  const name = suburb.name;
  let answer: React.ReactNode;
  if (model?.current) {
    const phrase = houseUnitPhrase(model.current.house, model.current.unit);
    answer = phrase ? (
      <p>
        {`${name}'s median weekly rent is `}<strong className="font-semibold">{phrase}</strong>{model.provenance ? ` (${model.provenance}).` : "."}
      </p>
    ) : null;
  } else if (all) {
    const c = all.current;
    answer = (
      <p>
        {`${name}'s median weekly rent is `}<strong className="font-semibold">{`${money(c.weekly)} across all dwellings`}</strong>
        {`, from ${c.bonds !== null ? `${c.bonds.toLocaleString("en-AU")} bonds` : "the bonds"} lodged in ${c.span} (${c.label}).`}
      </p>
    );
  } else if (latest) {
    const phrase = houseUnitPhrase(positive(latest.medianRentHouse) ? latest.medianRentHouse : null, positive(latest.medianRentUnit) ? latest.medianRentUnit : null);
    answer = phrase ? (
      <p>
        {`${name}'s median weekly rent is `}<strong className="font-semibold">{phrase}</strong>
        {latestLabel ? ` (${latestLabel}, ${latestWhen}).` : ` (${latestWhen}).`}
      </p>
    ) : null;
  }
  if (!answer) {
    answer = history.length > 0 && latestWhen ? (
      <p>{`The latest published rents for ${name} are below${latestLabel ? ` (${latestLabel}, ${latestWhen})` : ` (${latestWhen})`}, with what property managers charge in ${landlord.fees?.name ?? suburb.state}.`}</p>
    ) : (
      <p>{`No median rent is published for ${name} yet. Below: what property managers charge in ${landlord.fees?.name ?? suburb.state}, and what to ask before you sign.`}</p>
    );
  }

  const sellHref = guideFunnelHref("selling", { suburb: slug, from: "rental-market", toForm: true });
  const nearbyWithRent = nearby.filter((n) => n.rent);
  const stateLower = suburb.state.toLowerCase();
  const nextSteps: NextStepGroup[] = [
    {
      title: `More on ${name}`,
      links: [
        { href: `/suburbs/${slug}`, label: `${name} suburb profile` },
        ...(hasReliablePrice(suburb) ? [{ href: `/suburbs/${slug}#market`, label: `${name} house prices` }] : []),
        ...(suburb.schools.length > 0 ? [{ href: `/suburbs/${slug}/schools`, label: `Schools in ${name}` }] : []),
        { href: `/suburbs/${slug}/agents`, label: `Real estate agents in ${name}` },
      ],
    },
    {
      title: "Selling an investment property",
      links: [
        { href: "/guides/selling-a-house-with-tenants", label: "Selling with a tenant in place" },
        { href: "/cgt-calculator", label: "Capital gains tax calculator" },
        { href: `/guides/cost-of-selling-a-house-${stateLower}`, label: `Cost of selling in ${suburb.state}` },
        { href: `/guides/real-estate-commission-${stateLower}`, label: `Agent commission in ${suburb.state}` },
      ],
    },
    {
      title: "Landlords and investors",
      links: [
        { href: "/guides/property-management-fees-australia", label: "Property management fees by state" },
        { href: "/rental-yield-calculator", label: "Rental yield calculator" },
        { href: guideFunnelHref("buying", { suburb: slug, from: "rental-market" }), label: "Buying an investment? The free buying guide" },
      ],
    },
  ];

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
        title={`${model?.title ?? `${suburb.name} Rental Market | Rent Prices & Trends`} | ${SITE_NAME}`}
        description={model?.description ?? all?.description ?? `View rental price trends and history for ${suburb.name}, ${suburb.state}. Compare weekly rent for houses, units, and bedrooms.`}
        url={`/suburbs/${slug}/rental-market`}
        datePublished="2025-01-01"
      />

      <SuburbSubrouteHeader
        suburb={suburb}
        title={`${name} rental market`}
        subtitle={answer}
        breadcrumbLeaf="Rental Market"
        tabs={getSuburbListingTabs(slug, "rental-market", availability)}
        action={
          <SubrouteActionCard
            heading="Thinking of selling your investment?"
            body={`The free selling guide covers capital gains tax, selling with a tenant in place and choosing an agent, personalised to ${name}.`}
            href={sellHref}
            cta="Get the free selling guide"
          >
            <p>
              <Link href={`/suburbs/${slug}/agents#appraisal`} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">
                Want a price first? Free appraisal from a local agent
              </Link>
            </p>
            <p className="mt-2">
              {"Renting here? See the "}
              <Link href={`/suburbs/${slug}`} className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">{`${name} profile`}</Link>
              {nearbyWithRent.length > 0 ? (
                <>
                  {" and "}
                  <a href="#nearby-rents" className="text-ink underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary">rents nearby</a>
                </>
              ) : null}
              .
            </p>
          </SubrouteActionCard>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {model?.current ? (
          <RentalMarketSections suburb={suburb} slug={slug} model={model} landlord={landlord} />
        ) : history.length === 0 ? (
          // The header already says no rent is published; point at the
          // listings when there are some, else straight on to the fees.
          availability.rent && (
            <p className="font-sans text-base text-ink">
              <Link
                href={`/suburbs/${slug}/rent`}
                className="inline-flex items-center gap-2 font-medium underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary"
              >
                Browse current rental listings in {suburb.name} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </p>
          )
        ) : all ? (
          <RentalMarketAllDwellings name={suburb.name} slug={slug} all={all} rentListings={availability.rent} />
        ) : (
          <>
            {legacyCards.some(([label]) => label.includes("bedroom")) && (
              <section id="current-rent" className="scroll-mt-20">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-5">
                  Median weekly rent in {name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {legacyCards.map(([label, v]) => (
                    <MetricCard key={label} label={label} value={`${money(v as number)}/wk`} />
                  ))}
                </div>
                <p className="font-sans text-xs text-ink-subtle mt-3">
                  {`Source: ${latestLabel ?? "state rental data"}, ${latestWhen}. Medians of new rentals recorded in the period.`}
                </p>
              </section>
            )}

            {/* Yield vs price: keeps the median for the yield, labelled and
                linked to the profile's price section (review 10 Oct 2026,
                suburbs 3.1: price-anchor links back to the profile). */}
            {grossYield && suburb.stats.medianHousePrice > 0 && (
              <section id="yield" className="scroll-mt-20 rounded-xl border border-line p-5 sm:p-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-5">
                  Rental yield against the purchase price
                </h2>
                <dl className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <dt className="font-sans text-[13px] text-ink-muted mb-1.5">Median house price</dt>
                    <dd className="font-display text-xl sm:text-3xl font-bold text-ink leading-none">{formatPriceFull(suburb.stats.medianHousePrice)}</dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[13px] text-ink-muted mb-1.5">Median house rent</dt>
                    <dd className="font-display text-xl sm:text-3xl font-bold text-ink leading-none">{money(currentRent)}/wk</dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[13px] text-ink-muted mb-1.5">Gross yield</dt>
                    <dd className="font-display text-xl sm:text-3xl font-bold text-ink leading-none">{grossYield}%</dd>
                  </div>
                </dl>
                <p className="font-sans text-xs text-ink-subtle mt-5 leading-relaxed">
                  {"Gross yield = weekly rent × 52 ÷ median house price. Before rates, insurance, management fees, maintenance and vacancy. The "}
                  <Link href="/rental-yield-calculator" className="underline hover:text-primary">rental yield calculator</Link>
                  {" gives a net estimate. Price: "}
                  <Link href={`/suburbs/${slug}#market`} className="underline hover:text-primary">{`${name} median house price`}</Link>
                  {"."}
                </p>
              </section>
            )}

            {history.length > 1 && (
              <section id="history" className="scroll-mt-20">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-5">
                  How rents have moved
                </h2>
                <div className="overflow-x-auto rounded-xl border border-line">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-warm border-b border-line">
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-ink">Period</th>
                        <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Houses</th>
                        {legacyColumns.unit && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink">Units</th>}
                        {legacyColumns.bed3 && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">3 bed</th>}
                        {legacyColumns.bed2 && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden sm:table-cell">2 bed</th>}
                        {legacyColumns.bonds && <th scope="col" className="py-3 px-4 text-right font-semibold text-ink hidden md:table-cell">New bonds</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row) => (
                        <tr key={row.id} className="border-b border-line last:border-0">
                          <td className="py-3 px-4 font-medium text-ink whitespace-nowrap">{monthYear(row.periodDate)}</td>
                          <td className="py-3 px-4 text-right text-ink">{positive(row.medianRentHouse) ? `${money(row.medianRentHouse)}/wk` : "–"}</td>
                          {legacyColumns.unit && <td className="py-3 px-4 text-right text-ink">{positive(row.medianRentUnit) ? `${money(row.medianRentUnit)}/wk` : "–"}</td>}
                          {legacyColumns.bed3 && <td className="py-3 px-4 text-right text-ink hidden sm:table-cell">{positive(row.medianRent3Bed) ? `${money(row.medianRent3Bed)}/wk` : "–"}</td>}
                          {legacyColumns.bed2 && <td className="py-3 px-4 text-right text-ink hidden sm:table-cell">{positive(row.medianRent2Bed) ? `${money(row.medianRent2Bed)}/wk` : "–"}</td>}
                          {legacyColumns.bonds && <td className="py-3 px-4 text-right text-ink hidden md:table-cell">{positive(row.bondLodgements) ? row.bondLodgements.toLocaleString("en-AU") : "–"}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Rental listings, as a link: only when there are some to browse */}
            {availability.rent && (
              <p className="font-sans text-base text-ink">
                <Link
                  href={`/suburbs/${slug}/rent`}
                  className="inline-flex items-center gap-2 font-medium underline decoration-line-strong underline-offset-4 hover:text-primary hover:decoration-primary"
                >
                  Properties for rent in {suburb.name} now <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </p>
            )}
          </>
        )}

        {!model?.current && (
          <>
            <RentalMarketLandlordSections suburb={suburb} landlord={landlord} />
            <Faq items={landlord.faqs} title={`Renting and investing in ${suburb.name}`} />
          </>
        )}

        <NearbyRents name={name} nearby={nearby} />

        <SubpageNextSteps id="next" title={`Next steps for ${name} owners`} groups={nextSteps} />

        {/* The same one action, once more where the page ends. */}
        <section className="rounded-xl bg-surface-inverse text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">Selling an investment property in {name}?</h2>
            <p className="font-sans text-sm text-white/75 mt-1.5 max-w-xl">Free guide, personalised to {name}: costs and tax, timing around a lease, and how to pick an agent.</p>
          </div>
          <Link
            href={sellHref}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white px-5 py-3 text-sm font-semibold transition-colors"
          >
            Get the free selling guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
