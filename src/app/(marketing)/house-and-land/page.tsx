import type { Metadata } from "next";
import Image from "next/image";
import { HouseLandCard } from "@/components/property/HouseLandCard";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { getHouseAndLandPackages } from "@/lib/services/house-and-land-service";
import { SITE_URL } from "@/lib/constants";

// Page body queries the DB; render on every request (no build-time prerender,
// no stale cache). Add HTTP caching at the edge later if traffic warrants it.
export const revalidate = 86400;

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function suburbDisplayName(slug: string): string {
  return slug.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { suburb } = await searchParams;
  const suburbName = suburb ? suburbDisplayName(suburb) : null;
  const title = suburbName ? `House & Land Packages in ${suburbName}` : "House & Land Packages";
  const description = suburbName
    ? `Browse new house and land packages in ${suburbName}.`
    : "Browse house and land packages across Australia. New homes from top builders at competitive prices.";
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/house-and-land` },
    openGraph: { url: `${SITE_URL}/house-and-land`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HouseAndLandPage({ searchParams }: PageProps) {
  const { suburb } = await searchParams;
  // Skip the DB at build (Railway proxy drops build-time connections); ISR
  // (revalidate above) fills real data on first request. Empty renders cleanly
  // — the page shows a "No packages found" empty state below.
  const packages =
    process.env.NEXT_PHASE === "phase-production-build"
      ? ([] as Awaited<ReturnType<typeof getHouseAndLandPackages>>)
      : await getHouseAndLandPackages(suburb);
  const suburbName = suburb ? suburbDisplayName(suburb) : null;

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "House & Land", url: "/house-and-land" }]} />

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
            <Breadcrumbs items={[{ label: "House & Land" }]} />
          </div>

          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {packages.length} new {packages.length !== 1 ? "packages" : "package"}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {suburbName ? (
              <>House &amp; land in <span className="italic text-primary">{suburbName}</span>.</>
            ) : (
              <>House &amp; land, <span className="italic text-primary">brand new</span>.</>
            )}
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            New build packages from top Australian builders, with land titled, fixed prices,
            and stamp-duty savings on the building component.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <HouseLandCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-ink-muted">
            No packages found{suburbName ? ` in ${suburbName}` : ""}.
          </p>
        )}
      </div>
    </>
  );
}
