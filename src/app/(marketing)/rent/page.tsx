import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { RentResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the RentResults Suspense child below so the parent stays in the CDN cache.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Rent Property in Australia",
  description: "Find houses, units, and apartments for rent across Australia. Browse rental listings by suburb, price, and bedrooms.",
  alternates: { canonical: `${SITE_URL}/rent` },
  openGraph: { url: `${SITE_URL}/rent`, title: "Rent Property in Australia", description: "Find houses, units, and apartments for rent across Australia.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface RentPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default function RentPage({ searchParams }: RentPageProps) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Rent", url: "/rent" }]} />

      <PhotoHero photo="flats" breadcrumbs={[{ label: "Rent" }]}>
        <HeroTitle>
          Properties for rent, <span>around Australia</span>
        </HeroTitle>
        <HeroLead>
          Houses, units and apartments. Filter by suburb, price, bedrooms.
          Suburb data and tenant rights guides alongside every listing.
        </HeroLead>
      </PhotoHero>

      {/* The filters and results are the page's job: first band under the hero. */}
      <Band tone="quiet" spacing="compact">
        <div className="mb-8">
          <Suspense fallback={null}>
            <PropertyFilters listingType="rent" />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <RentResults searchParams={searchParams} />
        </Suspense>
      </Band>
    </>
  );
}
