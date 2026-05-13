import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bed, Bath, Car, Maximize2, MapPin, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { Badge } from "@/components/ui";
import { getBestDealById, formatBestDealPrice } from "@/lib/services/best-deal-service";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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
  const title = `${deal.title} | ${SITE_NAME} Best Deals`;
  const description = deal.headline;
  const url = `${SITE_URL}/best-deals/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
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

      <section className="bg-surface-warm border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <Breadcrumbs items={breadcrumb} />
        </div>
      </section>

      <article className="bg-surface-raised">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Hero + body */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-line bg-surface-warm mb-3">
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
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
                  {deal.gallery.slice(0, 8).map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-surface-warm border border-line">
                      <Image src={src} alt={`${deal.title} photo ${i + 2}`} fill sizes="120px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-5">
                {deal.dealTypes.map((t) => (
                  <Badge key={t} variant="outline">{t.replace("-", " ")}</Badge>
                ))}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.1] tracking-tight mb-4">
                {deal.title}
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                {deal.headline}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 border-y border-line text-sm font-sans text-ink-muted mb-8">
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary underline decoration-line-strong underline-offset-4"
                  >
                    View agent&rsquo;s full listing <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              )}

              <div className="rounded-2xl border border-line-warm bg-surface-warm p-5 sm:p-6">
                <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-2">
                  Partner disclosure
                </p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  {deal.disclosureText}
                </p>
              </div>
            </div>

            {/* Sticky agent panel */}
            <aside className="lg:col-span-5 lg:order-2">
              <div className="lg:sticky lg:top-24 space-y-5">
                <div className="rounded-2xl border border-line bg-surface-raised p-6 shadow-card">
                  <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">
                    Price guide
                  </p>
                  <p className="font-display text-3xl sm:text-4xl text-ink leading-none mb-1">
                    {price}
                  </p>
                  {deal.priceText && (deal.priceMin || deal.priceMax) && (
                    <p className="font-sans text-sm text-ink-muted mt-1">{deal.priceText}</p>
                  )}

                  {deal.agent && (
                    <div className="mt-6 pt-6 border-t border-line flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-warm border border-line">
                        {deal.agent.image && (
                          <Image src={deal.agent.image} alt={deal.agent.fullName} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ink text-sm">{deal.agent.fullName}</p>
                        {deal.agent.agencyName && (
                          <p className="text-xs text-ink-muted">{deal.agent.agencyName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/?intent=buying#match`}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-surface-raised hover:bg-primary font-medium px-5 py-3 transition-colors"
                  >
                    Get connected{deal.agent ? ` with ${deal.agent.fullName.split(" ")[0]}` : ""}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] font-sans text-ink-subtle mt-3 leading-relaxed text-center">
                    Free for buyers. We&rsquo;re paid only when matched work goes ahead.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-surface-warm p-5">
                  <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">
                    Listed for
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    This deal expires on{" "}
                    <span className="text-ink font-medium">
                      {new Date(deal.expiresAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    .
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-surface-raised p-5">
                  <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-ink-subtle mb-3">
                    Why we feature these
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed mb-3">
                    A small, vetted set of partner-agent properties. Every deal is reviewed before
                    it goes live. Buyers and sellers never pay us.
                  </p>
                  <Link href="/about" className="text-sm font-medium text-ink hover:text-primary inline-flex items-center gap-1">
                    Read our charter <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
