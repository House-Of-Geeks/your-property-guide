import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { SchoolsResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the SchoolsResults Suspense child below so the parent stays in the CDN
// cache. Filter-aware metadata was previously dynamic; now static for cache.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Find a School | Browse 9,600+ Australian Schools | Your Property Guide",
  description: "Browse 9,600+ schools across Australia. Filter by type, sector, and state. Click any school to view its catchment area and nearby properties.",
  alternates: { canonical: `${SITE_URL}/schools` },
  openGraph: { url: `${SITE_URL}/schools`, title: "Find a School | Browse 9,600+ Australian Schools", description: "Browse 9,600+ schools across Australia. Filter by type, sector, and state.", type: "website" },
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

      <section className="relative bg-surface-warm border-b border-line overflow-hidden">
        <Image
          src="/images/illustrations/contour.svg"
          alt=""
          width={1200}
          height={800}
          aria-hidden="true"
          className="absolute -right-40 -top-40 w-[1100px] max-w-none opacity-[0.10] pointer-events-none select-none"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Schools" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            9,600+ schools nationally
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Find your <span className="italic text-primary">school</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Search every public, Catholic, and independent school in Australia, with catchments,
            ICSEA, and nearby suburbs all in one view.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={null}>
          <SchoolsResults searchParams={searchParams} />
        </Suspense>

        <p className="text-xs font-sans text-ink-subtle mt-10 text-center">
          School data sourced from ACARA, licensed under CC BY 4.0.
        </p>
      </div>
    </>
  );
}
