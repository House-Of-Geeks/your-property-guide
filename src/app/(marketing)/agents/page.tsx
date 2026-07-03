import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { AgentSearch } from "@/components/search/AgentSearch";
import { SITE_URL } from "@/lib/constants";
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
            <Breadcrumbs items={[{ label: "Find Agents" }]} />
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <span className="font-display italic text-primary text-base sm:text-lg leading-none">
                  Local agent network
                </span>
                <span className="w-12 h-px bg-line-strong" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.32em] text-ink-subtle font-sans font-medium">
                  Vetted directory
                </span>
              </div>
              <h1 className="font-display text-ink leading-[0.98] tracking-tight text-5xl sm:text-6xl lg:text-7xl mb-8 max-w-[20ch] font-medium">
                Find your{" "}
                <span className="italic font-light text-primary">local agent</span>.
              </h1>
              <p className="font-display font-light text-xl sm:text-2xl text-ink leading-[1.25] max-w-2xl mb-8">
                Browse trusted local real estate agents across Australia.
                Search by suburb to see who knows your area.
              </p>
              <div className="max-w-xl">
                <AgentSearch />
              </div>
            </div>
            <Image
              src="/images/illustrations/expert-match.svg"
              alt=""
              width={320}
              height={220}
              aria-hidden="true"
              className="hidden lg:block w-[280px] h-auto opacity-90"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={null}>
          <AgentsResults searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
