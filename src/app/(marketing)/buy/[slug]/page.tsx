import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Bed, Bath, Car, Ruler, Calendar, MapPin, ChevronRight } from "lucide-react";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyDescriptionExpand } from "@/components/property/PropertyDescriptionExpand";
import { PropertyFAQs } from "@/components/property/PropertyFAQs";
import { PropertySchoolTabs } from "@/components/property/PropertySchoolTabs";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AgentSidebarCard } from "@/components/property/AgentSidebarCard";
import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getPropertyBySlug, getPropertiesByAgency } from "@/lib/services/property-service";
import { getAgentById, getAgencyById } from "@/lib/services/agent-service";
import { propertyTitle, propertyDescription, absoluteUrl } from "@/lib/utils/seo";
import { formatDate, formatPercentage, formatPriceFull } from "@/lib/utils/format";
import { db } from "@/lib/db";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { medianBasis } from "@/lib/published-medians";
import { hasRentalRow } from "@/lib/suburb-subpages";
import { salesProvenanceFor } from "@/lib/suburb-snapshot";
import { monthYear, rentalSourceLabel } from "@/lib/rental-labels";
import { SITE_URL } from "@/lib/constants";
import { PropertyActions } from "@/components/property/PropertyActions";
import { PropertyMap } from "@/components/property/PropertyMap";
import { Band, HeroTitle, PhotoHero } from "@/components/premium";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ISR, property detail pages. See /property/[slug]/page.tsx for the
// full rationale; same fix applied to the listing-type roots.
export const revalidate = 86400;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };

  const title = propertyTitle(property);
  const description = propertyDescription(property);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/buy/${property.slug}` },
    openGraph: {
      url: `${SITE_URL}/buy/${property.slug}`,
      title,
      description,
      images: [{ url: absoluteUrl(property.images[0]?.url ?? "") }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  // No auth() / isPropertySaved() here. Reading session cookies on a public
  // detail page forces dynamic rendering and prevents CDN caching.
  // PropertyActions fetches saved status client-side after hydration.
  const [agent, coAgent, agency, suburbData, suburbHazard, agencyListings] = await Promise.all([
    getAgentById(property.agentId),
    property.coAgentId ? getAgentById(property.coAgentId) : Promise.resolve(null),
    getAgencyById(property.agencyId),
    db.suburb.findUnique({
      where: { slug: property.suburbSlug },
      include: {
        schools: {
          orderBy: { distance: "asc" },
          take: 8,
        },
      },
    }),
    db.suburbHazard.findUnique({ where: { suburbSlug: property.suburbSlug } }),
    getPropertiesByAgency(property.agencyId, 4),
  ]);

  const otherListings = agencyListings.filter((p) => p.id !== property.id).slice(0, 3);

  // The suburb's figures as its own page prints them (fix item 47): read
  // through the suburb service, so this box cannot print a median, a change
  // or a rent that the suburb page withholds. Until 29 Sep 2026 it printed
  // the raw columns, days on market among them, which no feed measures.
  // Awaited after the queries above: the runtime pool holds one connection.
  const suburbProfile = suburbData ? await getSuburbBySlug(property.suburbSlug) : null;
  const profileStats = suburbProfile?.stats;
  const priceBasis = medianBasis(suburbProfile?.dataFreshness?.salesSource);
  const publishedMedian = profileStats && profileStats.medianHousePrice > 0 ? profileStats.medianHousePrice : 0;
  const publishedChange = publishedMedian > 0 && profileStats?.annualGrowthHouse ? profileStats.annualGrowthHouse : 0;
  const publishedRent =
    suburbProfile && profileStats && hasRentalRow(suburbProfile) && profileStats.medianRentHouse > 0
      ? profileStats.medianRentHouse
      : 0;
  const suburbInsights = [
    ...(publishedMedian > 0
      ? [{ label: priceBasis === "area" ? "Area median house price" : "Median house price", value: formatPriceFull(publishedMedian) }]
      : []),
    ...(publishedChange !== 0 ? [{ label: "12-month change", value: formatPercentage(publishedChange) }] : []),
    ...(publishedRent > 0 ? [{ label: "Median house rent/wk", value: `$${publishedRent.toLocaleString("en-AU")}` }] : []),
  ];
  const rentLabel = rentalSourceLabel(suburbProfile?.dataFreshness?.rentalSource, property.address.postcode);
  const rentAsOf = suburbProfile?.dataFreshness?.rentalAsOf;
  const priceSource = publishedMedian > 0 && suburbProfile ? salesProvenanceFor(suburbProfile)?.short ?? null : null;
  const insightSources = [
    ...(priceSource ? [`Prices: ${priceSource}`] : []),
    ...(publishedRent > 0 && rentLabel ? [`Rent: ${rentLabel}${rentAsOf ? `, ${monthYear(new Date(rentAsOf))}` : ""}`] : []),
  ];

  const mapAddress = encodeURIComponent(property.address.full);
  const mapLat = suburbData?.lat ?? null;
  const mapLng = suburbData?.lng ?? null;

  const schools = (suburbData?.schools ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    sector: s.sector,
    distance: s.distance,
    yearRange: s.yearRange,
    icsea: s.icsea,
  }));

  // Build FAQ data from property
  const faqs = [
    {
      question: `How many bedrooms does ${property.address.street}, ${property.address.suburb} ${property.address.state} ${property.address.postcode} have?`,
      answer: `${property.address.street} has ${property.features.bedrooms} bedroom${property.features.bedrooms !== 1 ? "s" : ""}, ${property.features.bathrooms} bathroom${property.features.bathrooms !== 1 ? "s" : ""} and ${property.features.carSpaces} car space${property.features.carSpaces !== 1 ? "s" : ""}.`,
    },
    ...(property.features.landSize ? [{
      question: `What is the land size of ${property.address.street}, ${property.address.suburb}?`,
      answer: `The land area of ${property.address.street} is ${property.features.landSize.toLocaleString()} m².${property.features.buildingSize ? ` The house size is ${property.features.buildingSize.toLocaleString()} m².` : ""}`,
    }] : []),
    {
      question: `What is the listing price for ${property.address.street}, ${property.address.suburb}?`,
      answer: `${property.address.street} is listed at ${property.price.display}. Contact the listing agent ${agent?.fullName ?? ""} at ${agency?.name ?? ""} for more information.`,
    },
    {
      question: `Who is the agent for ${property.address.street}, ${property.address.suburb}?`,
      answer: `The listing agent is ${agent?.fullName ?? "the agency"} from ${agency?.name ?? "the listed agency"}. You can enquire via the contact form on this page or call ${agent?.phone ?? ""}.`,
    },
    // Asked and answered only where the suburb's own page publishes a median.
    ...(publishedMedian > 0 ? [{
      question: `What is the median house price in ${property.address.suburb}?`,
      answer:
        (priceBasis === "area"
          ? `The median house price for the ABS statistical area that takes in ${property.address.suburb} is ${formatPriceFull(publishedMedian)}.`
          : `The median house price in ${property.address.suburb} is ${formatPriceFull(publishedMedian)}.`) +
        (publishedChange !== 0 ? ` It moved ${formatPercentage(publishedChange)} over 12 months.` : ""),
    }] : []),
  ];

  return (
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        items={[
          { name: "Buy", url: "/buy" },
          { name: property.address.suburb, url: `/suburbs/${property.suburbSlug}` },
          { name: property.address.street, url: `/buy/${property.slug}` },
        ]}
      />

      {/* ── Hero: plain charcoal (never the listing's own photo), carrying
          the address, the price and the key features ─────────────────── */}
      <PhotoHero
        breadcrumbs={[
          { label: "Buy", href: "/buy" },
          { label: property.address.suburb, href: `/suburbs/${property.suburbSlug}` },
          { label: property.address.street },
        ]}
      >
        <HeroTitle>
          {property.address.street},{" "}
          <Link href={`/suburbs/${property.suburbSlug}`} className="text-ink underline decoration-line-strong underline-offset-[0.15em] hover:decoration-ink">
            {property.address.suburb}
          </Link>{" "}
          {property.address.state} {property.address.postcode}
        </HeroTitle>
        <p className="mt-6 text-3xl sm:text-4xl font-bold text-ink leading-tight tracking-[-0.03em]">
          {property.price.display}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-ink-muted">
          <span className="flex items-center gap-1.5 text-base">
            <Bed className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
            <strong className="font-semibold text-ink">{property.features.bedrooms}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-base">
            <Bath className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
            <strong className="font-semibold text-ink">{property.features.bathrooms}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-base">
            <Car className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
            <strong className="font-semibold text-ink">{property.features.carSpaces}</strong>
          </span>
          {property.features.landSize && (
            <span className="flex items-center gap-1.5 text-base">
              <Ruler className="w-5 h-5 text-ink-subtle" aria-hidden="true" />
              <strong className="font-semibold text-ink">{property.features.landSize.toLocaleString()} m²</strong>
            </span>
          )}
          <Badge variant="outline">{property.propertyType}</Badge>
          {property.status === "under-contract" && <Badge variant="outline">Under Contract</Badge>}
        </div>
      </PhotoHero>

      {/* ── The listing's gallery, then the main layout ──────────────
          PropertyActions sits in this band, not in the hero: the hero is its
          own stacking context, so its share modal would open under this band. */}
      <Band spacing="compact">
        <div className="rounded-xl overflow-hidden">
          <PropertyGallery
            images={property.images}
            address={property.address.full}
            inspectionTime={(property.inspectionTimes ?? [])[0]}
            agentPhone={agent?.phone}
            enquireHref="#enquire"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start mt-10">

          {/* ── LEFT column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12">

            {/* ── Property Description ─────────────────────────── */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em]">Property description</h2>
                <PropertyActions
                  propertyId={property.id}
                  address={property.address.full}
                />
              </div>
              <p className="text-sm text-ink-subtle mb-4">
                {agency?.name ?? ""} &nbsp;·&nbsp; Listed {formatDate(property.dateAdded)}
              </p>
              <PropertyDescriptionExpand description={property.description} />
            </div>

            {/* ── Inspection Times (mobile only) ───────────────── */}
            {(property.inspectionTimes ?? []).length > 0 && (
              <div className="lg:hidden">
                <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-4">Inspection times</h2>
                <div className="space-y-2">
                  {(property.inspectionTimes ?? []).map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink-muted border border-line rounded-lg px-4 py-3">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Map ──────────────────────────────────────────── */}
            <div>
              <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-3">Location</h2>
              <p className="text-sm text-ink-muted flex items-center gap-1.5 mb-4">
                <MapPin className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                {property.address.full}
              </p>
              {mapLat && mapLng ? (
                <div>
                  <PropertyMap lat={mapLat} lng={mapLng} address={property.address.full} />
                  <a
                    href={`https://maps.google.com/?q=${mapAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              ) : (
                <a
                  href={`https://maps.google.com/?q=${mapAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-32 rounded-xl border border-line bg-surface-warm text-sm font-semibold text-ink hover:border-ink transition-colors"
                >
                  View on Google Maps →
                </a>
              )}
            </div>

            {/* ── School Catchment ─────────────────────────────── */}
            {schools.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-2">
                  School catchment zones for {property.address.suburb}
                </h2>
                <p className="text-sm text-ink-subtle mb-4">Schools near this property</p>
                <PropertySchoolTabs schools={schools} />
              </div>
            )}

            {/* ── Suburb Insights ───────────────────────────────── */}
            {suburbData && (
              <div>
                {/* Suburb-wide figures for houses, not for homes of this size. */}
                <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-5">
                  Insights for {property.address.suburb}
                </h2>
                {suburbInsights.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {suburbInsights.map((i) => (
                      <InsightStat key={i.label} label={i.label} value={i.value} />
                    ))}
                  </div>
                )}

                {/* Walkability + hazard badges */}
                {(suburbData.walkScore != null || suburbHazard) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {suburbData.walkScore != null && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-info/10 border border-info/30 px-3 py-1 text-xs font-medium text-info">
                        Walk score: {suburbData.walkScore}
                      </span>
                    )}
                    {suburbHazard?.floodClass && suburbHazard.floodClass !== "low" && (
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium ${suburbHazard.floodClass === "high" || suburbHazard.floodClass === "floodway" ? "bg-danger/10 border-danger/30 text-danger" : "bg-warning/10 border-warning/30 text-warning"}`}>
                        Flood: {suburbHazard.floodClass}
                      </span>
                    )}
                    {suburbHazard?.bushfireRisk && suburbHazard.bushfireRisk !== "low" && (
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium ${suburbHazard.bushfireRisk === "high" ? "bg-danger/10 border-danger/30 text-danger" : "bg-warning/10 border-warning/30 text-warning"}`}>
                        Bushfire: {suburbHazard.bushfireRisk}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 flex-wrap gap-2">
                  <Link
                    href={`/suburbs/${property.suburbSlug}`}
                    className="inline-flex items-center gap-1 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                  >
                    View suburb profile <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  {insightSources.length > 0 && (
                    <p className="text-sm text-ink-subtle">{insightSources.join(" · ")}</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Other properties from this agency ─────────────── */}
            {otherListings.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-2">
                  Other properties for sale from {agency?.name}
                </h2>
                <p className="text-sm text-ink-muted mb-5">
                  {agency?.name} is currently selling {agencyListings.length} properties.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherListings.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Property FAQs ─────────────────────────────────── */}
            <div>
              <h2 className="text-2xl sm:text-3xl text-ink leading-tight tracking-[-0.02em] mb-5">
                Property FAQs
              </h2>
              <PropertyFAQs faqs={faqs} />
            </div>
          </div>

          {/* ── RIGHT: sticky sidebar ─────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {agent && (
                <AgentSidebarCard
                  agents={[agent, ...(coAgent ? [coAgent] : [])]}
                  agency={agency}
                  propertyId={property.id}
                  agencyId={property.agencyId}
                  propertyAddress={property.address.full}
                  inspectionTimes={property.inspectionTimes ?? []}
                  landSize={property.features.landSize}
                  buildingSize={property.features.buildingSize}
                  priceDisplay={property.price.display}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile agent card */}
        {agent && (
          <div className="lg:hidden mt-12">
            <AgentSidebarCard
              agents={[agent, ...(coAgent ? [coAgent] : [])]}
              agency={agency}
              propertyId={property.id}
              agencyId={property.agencyId}
              propertyAddress={property.address.full}
              inspectionTimes={property.inspectionTimes ?? []}
              landSize={property.features.landSize}
              buildingSize={property.features.buildingSize}
              priceDisplay={property.price.display}
            />
          </div>
        )}
      </Band>
    </>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-raised border border-line p-5">
      <p className="text-2xl font-bold text-ink leading-tight tracking-[-0.02em]">{value}</p>
      <p className="text-sm text-ink-subtle mt-2">{label}</p>
    </div>
  );
}
