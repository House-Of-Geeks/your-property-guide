import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
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
            <Breadcrumbs items={[{ label: "Buy" }]} />
          </div>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Properties for sale, <span className="italic text-primary">across Australia</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            Houses, units, townhouses and land. Filter by suburb, price, bedrooms.
            Each listing comes with the suburb&rsquo;s data alongside.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Suspense fallback={null}>
            <PropertyFilters listingType="buy" />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <BuyResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
