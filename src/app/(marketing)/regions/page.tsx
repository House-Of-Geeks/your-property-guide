import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo";
import { unstable_cache } from "next/cache";
import { getAllRegions } from "@/lib/services/region-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

// The index queries the DB. It used to be a static ISR page, which meant
// the build-time render (no DB, so no regions) was served for up to a day
// after every deploy. Render on request instead and cache the region list
// behind a tag, the same pattern the regions sitemap uses.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Property Regions Across Australia",
  description:
    "Browse real estate market data, median house prices, and properties for sale across every region in Australia.",
  alternates: { canonical: `${SITE_URL}/regions` },
  openGraph: { ...DEFAULT_OG,
    url: `${SITE_URL}/regions`,
    title: "Property Regions Across Australia",
    description: "Browse real estate and suburb profiles across every Australian region.",
    type: "website",
  },
};

const getCachedRegions = unstable_cache(getAllRegions, ["regions-index:v1", NOT_PLACES_VERSION], {
  revalidate: 86400,
  tags: ["sitemap-regions"],
});

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
  const regions = await getCachedRegions();

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

      <PhotoHero photo="market" breadcrumbs={[{ label: "Regions" }]}>
        <div className="flex items-center gap-4 mb-5">
          <span className="text-sm font-semibold text-ink-muted leading-none">
            {regions.length} regions
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span className="text-sm text-ink-muted leading-none">
            Nationwide coverage
          </span>
        </div>
        <HeroTitle>
          Property regions,{" "}
          <span>coast to coast</span>
        </HeroTitle>
        <HeroLead>
          Median house prices, market trends, and suburb profiles grouped by
          region, from the Sunshine Coast to the South West.
        </HeroLead>
      </PhotoHero>

      <Band tone="quiet" spacing="compact">
        <div className="space-y-14">
          {STATE_ORDER.map((state) => {
            const stateRegions = byState[state];
            if (!stateRegions?.length) return null;
            return (
              <section key={state}>
                <h2 className="text-2xl sm:text-3xl tracking-[-0.02em] text-ink mb-6 pb-3 border-b border-line">
                  {STATE_NAMES[state]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {stateRegions.map((region) => (
                    <Link
                      key={region.slug}
                      href={`/regions/${region.slug}`}
                      className="flex items-center justify-between rounded-xl border border-line bg-surface-raised px-4 py-3 hover:border-ink transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-ink group-hover:text-primary transition-colors truncate">
                          {region.region}
                        </span>
                      </div>
                      <span className="text-sm text-ink-subtle flex-shrink-0 ml-2">
                        {region.suburbCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Band>
    </>
  );
}
