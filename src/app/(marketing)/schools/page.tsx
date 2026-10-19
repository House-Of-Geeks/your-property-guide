import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { ExpertCTA } from "@/components/journey";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { SITE_URL } from "@/lib/constants";
import { SchoolsResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the SchoolsResults Suspense child below so the parent stays in the CDN
// cache. Filter-aware metadata was previously dynamic; now static for cache.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Find a School | Browse 9,600+ Australian Schools",
  description: "Browse 9,600+ schools across Australia. Filter by type, sector, and state. Click any school to view its catchment area and nearby properties.",
  alternates: { canonical: `${SITE_URL}/schools` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/schools`, title: "Find a School | Browse 9,600+ Australian Schools", description: "Browse 9,600+ schools across Australia. Filter by type, sector, and state.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface SchoolsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SchoolsPage({ searchParams }: SchoolsPageProps) {
  return (
    <>
      <CollectionPageJsonLd
        name="Australian Schools"
        description="Search and explore Australian schools with enrolment data and catchment information."
        url="/schools"
      />
      <BreadcrumbJsonLd items={[{ name: "Schools", url: "/schools" }]} />

      <PhotoHero photo="verandah" breadcrumbs={[{ label: "Schools" }]}>
        <p className="flex items-center gap-4 text-sm text-ink-muted mb-5">
          <span className="font-semibold">9,600+ schools</span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span>National coverage</span>
        </p>
        <HeroTitle>
          Find your{" "}
          <span>school</span>
        </HeroTitle>
        <HeroLead>
          Search every public, Catholic and independent school in Australia,
          with catchments, ICSEA, and nearby suburbs all in one view.
        </HeroLead>
      </PhotoHero>

      {/* The search form and results are the page's job: first band under the hero. */}
      <Band tone="quiet" spacing="compact">
        <Suspense fallback={null}>
          <SchoolsResults searchParams={searchParams} />
        </Suspense>

        <p className="text-sm text-ink-subtle mt-10 text-center">
          School data sourced from ACARA, licensed under CC BY 4.0.
        </p>
      </Band>

      {/* Buyer funnel exit. Catchment researchers are family buyers — the
          buying guide is the natural next step after shortlisting schools. */}
      <ExpertCTA
        headline="Found the right school? Now find the house."
        body="The complete buying guide for families: how school catchments affect prices, what you can actually spend, the 2026 schemes for your state, and how not to overpay. Free PDF, in your inbox in 60 seconds."
        ctaLabel="Get the free buying guide"
        href="/buying-guide"
      />
    </>
  );
}
