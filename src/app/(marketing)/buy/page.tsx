import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { BuyResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the BuyResults Suspense child below so the parent stays in the CDN cache
// while only the dynamic results chunk re-renders per filter combination.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Buy Property in Australia",
  description: "Browse houses, units, townhouses, and land for sale across Australia. Search by suburb, price, bedrooms, and more.",
  alternates: { canonical: `${SITE_URL}/buy` },
  openGraph: { url: `${SITE_URL}/buy`, title: "Buy Property in Australia", description: "Browse houses, units, townhouses, and land for sale across Australia.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface BuyPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default function BuyPage({ searchParams }: BuyPageProps) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Buy", url: "/buy" }]} />

      <PhotoHero photo="buying" breadcrumbs={[{ label: "Buy" }]}>
        <HeroTitle>
          Properties for sale, <span>across Australia</span>
        </HeroTitle>
        <HeroLead>
          Houses, units, townhouses and land. Filter by suburb, price, bedrooms.
          Each listing comes with the suburb&rsquo;s data alongside.
        </HeroLead>
      </PhotoHero>

      {/* The filters and results are the page's job: first band under the hero. */}
      <Band tone="quiet" spacing="compact">
        <div className="mb-8">
          <Suspense fallback={null}>
            <PropertyFilters listingType="buy" />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <BuyResults searchParams={searchParams} />
        </Suspense>
      </Band>
    </>
  );
}
