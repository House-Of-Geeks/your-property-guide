import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HouseLandCard } from "@/components/property/HouseLandCard";
import { RelatedGuidesSection } from "@/components/guide/GuideLinkList";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import {
  getHouseAndLandPackages,
  getLiveHouseAndLandPackageCount,
} from "@/lib/services/house-and-land-service";
import {
  NO_STOCK_DESCRIPTION,
  hasHouseAndLandStock,
  houseAndLandRobots,
} from "@/lib/house-and-land-indexability";
import { HUB_GUIDE_LISTS, hubGuideGroups } from "@/lib/guides/hub-guides";
import { SITE_URL } from "@/lib/constants";

// Rendered on every request: the suburb filter reads searchParams, which
// opts the route into dynamic rendering, so it is never prerendered at
// build and needs no build-time guard. The route exported
// `revalidate = 86400` until 1 Oct 2026; beside searchParams it had no
// effect, and the ISR rule is that a route exporting revalidate does not
// read searchParams at the top level, so it is gone.
//
// Indexing follows the stock (src/lib/house-and-land-indexability.ts): with
// no live package the page answers noindex, follow and the sitemaps leave it
// out; the first package makes it indexable again. The count is cached for
// an hour and shared with the sitemaps, so they change on the same request.
// While there is no stock the package query is not run at all.

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function suburbDisplayName(slug: string): string {
  return slug.replace(/-[a-z]{2,3}-\d{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { suburb } = await searchParams;
  const live = await getLiveHouseAndLandPackageCount();
  const suburbName = suburb ? suburbDisplayName(suburb) : null;
  const title = suburbName ? `House & Land Packages in ${suburbName}` : "House & Land Packages";
  const description = !hasHouseAndLandStock(live)
    ? NO_STOCK_DESCRIPTION
    : suburbName
      ? `Browse new house and land packages in ${suburbName}.`
      : "Browse house and land packages across Australia. New homes from top builders at competitive prices.";
  const robots = houseAndLandRobots(live);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/house-and-land` },
    ...(robots ? { robots } : {}),
    openGraph: { url: `${SITE_URL}/house-and-land`, title, description, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HouseAndLandPage({ searchParams }: PageProps) {
  const { suburb } = await searchParams;
  const suburbName = suburb ? suburbDisplayName(suburb) : null;
  const stocked = hasHouseAndLandStock(await getLiveHouseAndLandPackageCount());
  const packages = stocked ? await getHouseAndLandPackages(suburb) : [];
  const listed = packages.length > 0;
  const guides = HUB_GUIDE_LISTS["/house-and-land"];
  const noneListed = `No house and land packages are listed${suburbName ? ` in ${suburbName}` : ""} right now.`;

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

          {/* A count only when there is one to print: never "0 new packages". */}
          <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-5">
            {listed ? `${packages.length} new ${packages.length !== 1 ? "packages" : "package"}` : "House & land"}
          </p>
          <h1 className="font-display text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            {suburbName ? (
              <>House &amp; land in <span className="italic text-primary">{suburbName}</span>.</>
            ) : listed ? (
              <>House &amp; land, <span className="italic text-primary">brand new</span>.</>
            ) : (
              <>House &amp; land packages</>
            )}
          </h1>
          <p className="font-sans text-lg text-ink-muted leading-relaxed max-w-2xl">
            {listed
              ? "New build packages from top Australian builders, with land titled, fixed prices, and stamp-duty savings on the building component."
              : noneListed}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {listed ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <HouseLandCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl space-y-4 font-sans text-base text-ink-muted leading-relaxed">
            <p>
              When a builder or agent lists a package with us, it will appear on this page. Until then, the guides
              below cover what a package price leaves out, how to check a builder, and the grants and stamp duty that
              apply to a new home.
            </p>
            <p>
              To work out the duty on a purchase, use the{" "}
              <Link href="/stamp-duty-calculator" className="underline hover:text-primary">stamp duty calculator</Link>
              {". Every grant and scheme for a first home is on the "}
              <Link href="/first-home-buyers" className="underline hover:text-primary">first home buyers</Link>
              {" page."}
            </p>
            {stocked && suburbName && (
              <p>
                <Link href="/house-and-land" className="underline hover:text-primary">See every package listed</Link>
              </p>
            )}
          </div>
        )}
      </div>

      <RelatedGuidesSection heading={guides.heading} intro={guides.intro} groups={hubGuideGroups(guides)} id="guides" />
    </>
  );
}
