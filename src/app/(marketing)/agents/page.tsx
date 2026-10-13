import type { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AgentSearch } from "@/components/search/AgentSearch";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";
import { AgentsResults } from "./Results";

// ISR, page shell caches as static. searchParams reads are isolated to
// the AgentsResults Suspense child below so the parent stays in the CDN
// cache. Filter-aware metadata was previously dynamic; now static for cache.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Find a Real Estate Agent",
    // Directory paused (placeholder profiles only) per Andy, 2026-07-03 —
    // pages stay reachable but out of the index until real agents load.
    robots: { index: false, follow: true },
  description: "Browse experienced local real estate agents across Australia.",
  alternates: { canonical: `${SITE_URL}/agents` },
  openGraph: { url: `${SITE_URL}/agents`, title: "Find a Real Estate Agent", description: "Browse experienced local real estate agents across Australia.", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface AgentsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default function AgentsPage({ searchParams }: AgentsPageProps) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Find Agents", url: "/agents" }]} />

      <PhotoHero breadcrumbs={[{ label: "Find Agents" }]}>
        <p className="flex items-center gap-4 text-sm text-ink-muted mb-5">
          <span className="font-semibold">
            Local agent network
          </span>
          <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
          <span>
            Vetted directory
          </span>
        </p>
        <HeroTitle>
          Find your{" "}
          <span>local agent</span>
        </HeroTitle>
        <HeroLead>
          Browse trusted local real estate agents across Australia.
          Search by suburb to see who knows your area.
        </HeroLead>
      </PhotoHero>

      {/* The search box opens the first band (not the hero, whose
          overflow-hidden would clip its suggestion dropdown). */}
      <Band spacing="compact">
        <div className="max-w-xl">
          <AgentSearch />
        </div>

        <div className="mt-12">
          <Suspense fallback={null}>
            <AgentsResults searchParams={searchParams} />
          </Suspense>
        </div>
      </Band>
    </>
  );
}
