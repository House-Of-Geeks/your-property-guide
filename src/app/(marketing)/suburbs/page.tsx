import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { SuburbsResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the SuburbsResults Suspense child below so the parent stays in the CDN
// cache while only the dynamic results chunk re-renders per state/query.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Browse All Australian Suburbs | Property Data & Profiles",
  description: "Search every Australian suburb for property market data, median prices, school catchments, climate, walkability, and local insights.",
  alternates: { canonical: `${SITE_URL}/suburbs` },
  openGraph: { url: `${SITE_URL}/suburbs`, title: "Browse All Australian Suburbs", description: "Search every Australian suburb for property market data.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface PageProps {
  searchParams: Promise<{ state?: string; q?: string; count?: string }>;
}

export default function SuburbsPage({ searchParams }: PageProps) {
  return (
    <>
      <CollectionPageJsonLd
        name="Browse All Australian Suburbs"
        description="Search every Australian suburb for property market data, median prices, school catchments, and local insights."
        url="/suburbs"
      />
      <BreadcrumbJsonLd items={[{ name: "Suburbs", url: "/suburbs" }]} />

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
            <Breadcrumbs items={[{ label: "Suburbs" }]} />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
                Every Australian suburb
              </p>
              <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
                Australian suburbs, <span className="italic text-primary">data and all</span>.
              </h1>
              <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-xl">
                Median prices, growth, schools, walk score, climate, hazard and
                crime. Sourced and dated. No paywall, no sign-up, no email gate.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line-warm bg-surface-raised shadow-card overflow-hidden">
                <Image
                  src="/images/illustrations/suburb-data.svg"
                  alt=""
                  width={320}
                  height={220}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            <div className="flex items-start gap-3">
              <img src="/images/icons/median.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Median</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">house &amp; unit prices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/growth.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">12mo</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">growth &amp; trend</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/schools.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Schools</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">primary &amp; secondary</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/walkability.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Walk</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">score &amp; transit</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/hazard.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Risk</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">flood, bushfire, crime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img src="/images/icons/climate.svg" alt="" width={28} height={28} className="w-7 h-7 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-ink leading-none mb-1">Climate</p>
                <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">temp, rain, sun</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={null}>
          <SuburbsResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
