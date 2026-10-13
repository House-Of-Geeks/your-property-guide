import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { SoldResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the SoldResults Suspense child below so the parent stays in the CDN cache.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Sold Properties in Australia",
  description: "View recently sold properties across Australia. Research sale prices and market trends across suburbs.",
  alternates: { canonical: `${SITE_URL}/sold` },
  openGraph: { url: `${SITE_URL}/sold`, title: "Sold Properties in Australia", description: "View recently sold properties across Australia.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface SoldPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default function SoldPage({ searchParams }: SoldPageProps) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Sold", url: "/sold" }]} />

      <PhotoHero photo="auction" breadcrumbs={[{ label: "Sold" }]}>
        <HeroTitle>
          What homes <span>actually sold for</span>
        </HeroTitle>
        <HeroLead>
          The actual sale prices, not asking prices. Research suburb-level
          market trends with real comparable sales.
        </HeroLead>
      </PhotoHero>

      {/* The filters and results are the page's job: first band under the hero. */}
      <Band tone="quiet" spacing="compact">
        <div className="mb-8">
          <Suspense fallback={null}>
            <PropertyFilters listingType="sold" />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <SoldResults searchParams={searchParams} />
        </Suspense>
      </Band>
    </>
  );
}
