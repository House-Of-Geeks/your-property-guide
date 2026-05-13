import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
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
            <Breadcrumbs items={[{ label: "Sold" }]} />
          </div>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            What homes <span className="italic text-primary">actually sold for</span>.
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            The actual sale prices, not asking prices. Research suburb-level
            market trends with real comparable sales.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Suspense fallback={null}>
            <PropertyFilters listingType="sold" />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <SoldResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
