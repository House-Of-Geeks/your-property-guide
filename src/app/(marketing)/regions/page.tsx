import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { getAllRegions } from "@/lib/services/region-service";
import { SITE_URL } from "@/lib/constants";

// Page body queries the DB; render on every request to avoid build-time DB hits.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Property Regions Across Australia",
  description:
    "Browse real estate market data, median house prices, and properties for sale across every region in Australia.",
  alternates: { canonical: `${SITE_URL}/regions` },
  openGraph: {
    url: `${SITE_URL}/regions`,
    title: "Property Regions Across Australia",
    description: "Browse real estate and suburb profiles across every Australian region.",
    type: "website",
  },
};

const STATE_ORDER = ["QLD", "NSW", "VIC", "WA", "SA", "TAS", "ACT", "NT"];
const STATE_NAMES: Record<string, string> = {
  QLD: "Queensland",
  NSW: "New South Wales",
  VIC: "Victoria",
  WA:  "Western Australia",
  SA:  "South Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
  NT:  "Northern Territory",
};

export default async function RegionsPage() {
  const regions = await getAllRegions();

  // Group by state
  const byState = STATE_ORDER.reduce<Record<string, typeof regions>>((acc, state) => {
    acc[state] = regions.filter((r) => r.state === state);
    return acc;
  }, {});

  return (
    <>
      <CollectionPageJsonLd
        name="Australian Regions"
        description="Browse all Australian regions and their suburb profiles."
        url="/regions"
      />
      <BreadcrumbJsonLd items={[{ name: "Regions", url: "/regions" }]} />

      {/* Editorial hero */}
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
            <Breadcrumbs items={[{ label: "Regions" }]} />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <span className="font-display italic text-primary text-base sm:text-lg leading-none">
              {regions.length} regions
            </span>
            <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
              Nationwide coverage
            </span>
          </div>
          <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-10 max-w-[18ch] font-medium">
            Property regions,{" "}
            <span className="italic font-light text-primary">coast to coast</span>.
          </h1>
          <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-3xl">
            Median house prices, market trends, and suburb profiles grouped by
            region, from the Sunshine Coast to the South West.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {STATE_ORDER.map((state) => {
            const stateRegions = byState[state];
            if (!stateRegions?.length) return null;
            return (
              <section key={state}>
                <h2 className="font-display text-2xl text-ink mb-5 pb-2 border-b border-line">
                  {STATE_NAMES[state]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {stateRegions.map((region) => (
                    <Link
                      key={region.slug}
                      href={`/regions/${region.slug}`}
                      className="flex items-center justify-between rounded-xl border border-line bg-surface-raised px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0 group-hover:text-primary transition-colors" />
                        <span className="font-sans text-sm font-medium text-ink group-hover:text-primary transition-colors truncate">
                          {region.region}
                        </span>
                      </div>
                      <span className="font-sans text-xs text-ink-subtle flex-shrink-0 ml-2">
                        {region.suburbCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
