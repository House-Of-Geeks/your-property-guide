import { db } from "@/lib/db";
import { cache } from "react";
import { buildCityMarket, type CityMarket, type CityMarketRow } from "@/lib/services/city-market-service";
// Postal delivery names and institutions are not suburbs of a region.
import { LOCALITIES_ONLY } from "@/lib/non-localities";
import { withPublishedSales } from "@/lib/published-medians";

// State-level values that are not real SA3 regions, filter these out
const STATE_NAMES = new Set([
  "Queensland", "New South Wales", "Victoria", "Western Australia",
  "South Australia", "Tasmania", "Northern Territory", "Australian Capital Territory",
]);

const SKIP_REGIONS = new Set([
  ...STATE_NAMES,
  "No usual address",
  "Migratory - Offshore - Shipping",
  "Not Applicable",
]);

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s*-\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToRegionName(slug: string, regions: { region: string; slug: string }[]): string | null {
  return regions.find((r) => r.slug === slug)?.region ?? null;
}

export interface RegionSummary {
  region: string;
  slug: string;
  state: string;
  suburbCount: number;
}

// Cached for the duration of a request, avoids repeated DB hits on the same page render
export const getAllRegions = cache(async (): Promise<RegionSummary[]> => {
  const rows = await db.suburb.groupBy({
    by: ["region", "state"],
    where: LOCALITIES_ONLY,
    _count: { slug: true },
    orderBy: [{ state: "asc" }, { region: "asc" }],
  });

  return rows
    .filter((r) => r.region && r.region.trim() !== "" && !SKIP_REGIONS.has(r.region))
    .map((r) => ({
      region: r.region,
      slug: slugify(r.region),
      state: r.state,
      suburbCount: r._count.slug,
    }));
});

export async function getRegionBySlug(slug: string): Promise<RegionSummary | null> {
  const all = await getAllRegions();
  return all.find((r) => r.slug === slug) ?? null;
}

export async function getAllRegionSlugs(): Promise<string[]> {
  const all = await getAllRegions();
  return all.map((r) => r.slug);
}

export async function getRegionSuburbs(region: string) {
  const rows = await db.suburb.findMany({
    where: { region, ...LOCALITIES_ONLY },
    select: {
      slug: true,
      name: true,
      postcode: true,
      state: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
      statsSource: true,
      salesCountHouse: true,
    },
    orderBy: { name: "asc" },
  });
  // The figures each suburb's own page publishes, 0 where it publishes none
  // (fix item 47). Until 29 Sep 2026 the raw columns left here and the page
  // checked the source but not the five-sale floor.
  return rows.map(withPublishedSales);
}

// getRegionStats, an average of the raw median and growth columns with no
// trust gate, was removed on 29 Sep 2026: no page had called it since the
// region pages moved to getRegionMarket below.

/**
 * The region's market rollup: the same gated median-of-medians, busiest,
 * fastest-growing, most-affordable and premium lists the capital-city pages
 * use, built over the LGA's suburbs. Content gap item 6.
 */
export async function getRegionMarket(region: string): Promise<CityMarket> {
  const rows: CityMarketRow[] = await db.suburb.findMany({
    where: { region, ...LOCALITIES_ONLY },
    select: {
      slug: true,
      name: true,
      postcode: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      medianRentHouse: true,
      annualGrowthHouse: true,
      population: true,
      salesCountHouse: true,
      statsSource: true,
      salesUpdatedAt: true,
    },
  });
  return buildCityMarket(rows);
}
