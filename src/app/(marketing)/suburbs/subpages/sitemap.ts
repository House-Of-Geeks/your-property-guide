// Force-dynamic: the sitemap.ts file convention in Next 16 is cached as
// static by default. With our DB-only data source, the build-phase
// short-circuit ended up baking an empty sitemap that never regenerated
// despite `revalidate` (same workaround as ../sitemap.ts; the shared
// unstable_cache in @/lib/sitemap-data dedupes the heavy DB query).
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { SITE_URL } from "@/lib/constants";
import { getIndexableSuburbsForSitemaps } from "@/lib/sitemap-data";
import { getSuburbSlugsWithRentalData } from "@/lib/services/rental-service";
import { getSuburbSlugsWithReliablePrice } from "@/lib/services/suburb-service";
import { NOT_PLACES_VERSION } from "@/lib/non-localities";

// Suburb intent sub-pages (/suburbs/[slug]/schools etc.). Split into one
// sitemap per type: ~15k indexable suburbs × several types would overflow
// the 50,000-URL-per-sitemap limit combined, but each per-type file stays
// well under it. Exported because Next emits these at
// /suburbs/subpages/sitemap/{id}.xml and the sitemap index
// (src/app/sitemap.xml/route.ts) must enumerate them.
//
// The six listing sub-pages (buy, rent, houses, units, townhouses, land)
// were retired on 14 Oct 2026 and 308 to the suburb profile (next.config.ts,
// docs/portal-consolidation-2026-10-14.md). Their old sitemap ids now answer
// an empty urlset (the guard below).
export const SUBPAGE_TYPES = [
  "schools",
  "rental-market",
  "agents",
] as const;

export async function generateSitemaps() {
  return SUBPAGE_TYPES.map((id) => ({ id }));
}

// schools carries real data for every suburb and stays in the sitemap
// unconditionally. rental-market is gated below on having a rental row
// (5,530 of 17,872 indexable suburbs on 8 Sep 2026): the rest render "No
// rental data available yet" and noindex themselves (fix item 13).
const getCachedRentalSuburbs = unstable_cache(
  async () => getSuburbSlugsWithRentalData(),
  ["sitemap-rental-suburbs:v2", NOT_PLACES_VERSION],
  { revalidate: 86400, tags: ["sitemap-suburbs"] },
);

// agents pages (valuation plan item 4) index only where the suburb has a
// reliable median, since the fees section is worked on that figure; the
// page noindexes itself otherwise.
const getCachedReliablePriceSuburbs = unstable_cache(
  async () => getSuburbSlugsWithReliablePrice(),
  ["sitemap-reliable-price-suburbs:v3", NOT_PLACES_VERSION], // v2: also requires five recorded sales, as the page does
  { revalidate: 86400, tags: ["sitemap-suburbs"] },
);

const SUBPAGE_LABEL: Record<(typeof SUBPAGE_TYPES)[number], string> = {
  schools: "Schools",
  "rental-market": "Rental market",
  agents: "Agents",
};

export type SubpageSitemapLink = {
  url: string;
  title: string;
  lastModified: Date;
};

// The HTML sitemap calls this with the same type ids the XML urlset uses.
export async function getSubpageSitemapLinks(type: string): Promise<SubpageSitemapLink[]> {
  // force-dynamic means any /sitemap/{id}.xml request reaches this function,
  // so reject ids outside the known types rather than emitting junk URLs.
  if (!(SUBPAGE_TYPES as readonly string[]).includes(type)) return [];
  const kind = SUBPAGE_LABEL[type as (typeof SUBPAGE_TYPES)[number]];

  let suburbs = await getIndexableSuburbsForSitemaps();

  if (type === "rental-market") {
    const withData = new Set(await getCachedRentalSuburbs());
    suburbs = suburbs.filter(({ slug }) => withData.has(slug));
  }
  if (type === "agents") {
    const priced = new Set(await getCachedReliablePriceSuburbs());
    suburbs = suburbs.filter(({ slug }) => priced.has(slug));
  }

  return suburbs.map(({ slug, name, state, postcode, updatedAt }) => ({
    url: `${SITE_URL}/suburbs/${slug}/${type}`,
    title: `${kind} in ${name}, ${state} ${postcode}`,
    lastModified: updatedAt,
  }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const type = await props.id;
  const links = await getSubpageSitemapLinks(type);
  return links.map(({ url, lastModified }) => ({
    url,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
