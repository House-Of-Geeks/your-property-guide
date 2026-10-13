import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bed, Bath, Car, Maximize2, MapPin, ExternalLink } from "lucide-react";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getBestDealById, formatBestDealPrice } from "@/lib/services/best-deal-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BUTTON_PRIMARY, Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const deal = await getBestDealById(id);
  if (!deal) return { title: "Deal not found" };
  const title = `${deal.title} | Best Deals`;
  const description = deal.headline;
  const url = `${SITE_URL}/best-deals/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      // og titles don't get the root title.template — brand them explicitly
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      images: [{ url: deal.heroImage, alt: deal.title }],
    },
  };
}

export default async function BestDealDetailPage({ params }: PageProps) {
  const { id } = await params;
  const deal = await getBestDealById(id);
  if (!deal) notFound();

  const price = formatBestDealPrice(deal);
  const breadcrumb = [
    { label: "Best Deals", href: "/best-deals" },
    { label: `${deal.suburbName}, ${deal.state}` },
  ];

  // Offer schema for the Best Deal — surface to Google with explicit
  // partner-disclosure semantics. We use Offer (not RealEstateListing)
  // because the canonical listing is owned by the partner agent, not us.
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: deal.title,
    description: deal.pitch,
    url: `${SITE_URL}/best-deals/${id}`,
    image: deal.heroImage,
    seller: deal.agent
      ? {
          "@type": "RealEstateAgent",
          name: deal.agent.fullName,
          image: deal.agent.image,
          telephone: deal.agent.phone,
          email: deal.agent.email,
          ...(deal.agent.agencyName && {
            worksFor: { "@type": "Organization", name: deal.agent.agencyName },
          }),
        }
      : undefined,
    ...(deal.priceMin && { price: deal.priceMin, priceCurrency: "AUD" }),
    availability: "https://schema.org/InStock",
    areaServed: {
      "@type": "Place",
      name: `${deal.suburbName}, ${deal.state} ${deal.postcode}`,
    },
    validThrough: deal.expiresAt,
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Best Deals", url: "/best-deals" },
          { name: deal.title, url: `/best-deals/${id}` },
        ]}
      />
      <JsonLd data={offerSchema} />

      {/* Hero: plain charcoal (never the deal's own photo), carrying the
          title, the headline and the key facts. */}
      <PhotoHero breadcrumbs={breadcrumb}>
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <span className="text-sm font-semibold text-ink-muted leading-none">
            Featured deal
          </span>
          <div className="flex flex-wrap gap-2">
            {deal.dealTypes.map((t) => (
              <Badge key={t} variant="outline">{t.replace("-", " ")}</Badge>
            ))}
          </div>
        </div>

        <HeroTitle>
          {deal.title}
        </HeroTitle>
        <HeroLead>
          {deal.headline}
        </HeroLead>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-base text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-ink-subtle" />
            {deal.suburbName}, {deal.state} {deal.postcode}
          </span>
          {deal.bedrooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-ink-subtle" />
              {deal.bedrooms} bed
            </span>
          )}
          {deal.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-ink-subtle" />
              {deal.bathrooms} bath
            </span>
          )}
          {deal.carSpaces != null && (
            <span className="inline-flex items-center gap-1.5">
              <Car className="w-4 h-4 text-ink-subtle" />
              {deal.carSpaces} car
            </span>
          )}
          {deal.landArea != null && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-ink-subtle" />
              {deal.landArea} m²
            </span>
          )}
        </div>
      </PhotoHero>

      {/* The deal's own photos, the pitch and the disclosure, beside the
          sticky price and agent panel. */}
      <Band spacing="compact">
        <article>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Photos + body */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-line bg-surface-warm mb-3">
                <Image
                  src={deal.heroImage}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="accent">Featured · Partner agent</Badge>
                </div>
              </div>

              {deal.gallery.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-10">
                  {deal.gallery.slice(0, 8).map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-surface-warm border border-line">
                      <Image src={src} alt={`${deal.title} photo ${i + 2}`} fill sizes="120px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="prose-ypg max-w-none mb-8">
                <h2>Why we&rsquo;re featuring this deal</h2>
                <p>{deal.pitch}</p>
              </div>

              {deal.externalListingUrl && (
                <p className="mb-8">
                  <a
                    href={deal.externalListingUrl}
                    target="_blank"
                    rel="nofollow noopener"
                    className="inline-flex items-center gap-2 text-base font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                  >
                    View agent&rsquo;s full listing <ExternalLink className="w-4 h-4" />
                  </a>
                </p>
              )}

              <div className="rounded-xl border border-line bg-surface-warm p-5 sm:p-6">
                <p className="text-sm font-semibold text-ink mb-2">
                  Partner disclosure
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {deal.disclosureText}
                </p>
              </div>
            </div>

            {/* Sticky agent panel */}
            <aside className="lg:col-span-5 lg:order-2">
              <div className="lg:sticky lg:top-24 space-y-5">
                <div className="rounded-xl border border-line bg-surface-raised p-6">
                  <p className="text-sm text-ink-subtle mb-3">
                    Price guide
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-ink leading-none tracking-[-0.03em] mb-1">
                    {price}
                  </p>
                  {deal.priceText && (deal.priceMin || deal.priceMax) && (
                    <p className="text-sm text-ink-muted mt-2">{deal.priceText}</p>
                  )}

                  {deal.agent && (
                    <div className="mt-6 pt-6 border-t border-line flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-warm border border-line">
                        {deal.agent.image && (
                          <Image src={deal.agent.image} alt={deal.agent.fullName} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{deal.agent.fullName}</p>
                        {deal.agent.agencyName && (
                          <p className="text-sm text-ink-muted">{deal.agent.agencyName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/find-an-expert?intent=buying`}
                    className={`${BUTTON_PRIMARY} mt-6 w-full justify-center`}
                  >
                    Get connected
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-ink-subtle mt-3 leading-relaxed text-center">
                    Free for buyers. We match you with one vetted specialist, who pays us for the introduction.
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-surface-warm p-5">
                  <p className="text-sm font-semibold text-ink mb-2">
                    Listed for
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    This deal expires on{" "}
                    <span className="text-ink font-semibold">
                      {new Date(deal.expiresAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    .
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-surface-raised p-5">
                  <p className="text-sm font-semibold text-ink mb-2">
                    Why we feature these
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed mb-3">
                    A small, vetted set of partner-agent properties. Every deal is reviewed before
                    it goes live. Buyers and sellers never pay us.
                  </p>
                  <Link href="/about" className="text-sm font-semibold text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink inline-flex items-center gap-1">
                    Read our charter <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </Band>
    </>
  );
}
