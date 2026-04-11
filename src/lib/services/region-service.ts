import { db } from "@/lib/db";
import { cache } from "react";

// State-level values that are not real SA3 regions — filter these out
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

// Cached for the duration of a request — avoids repeated DB hits on the same page render
export const getAllRegions = cache(async (): Promise<RegionSummary[]> => {
  const rows = await db.suburb.groupBy({
    by: ["region", "state"],
    _count: { slug: true },
    orderBy: [{ state: "asc" }, { region: "asc" }],
  });

  return rows
    .filter((r) => !SKIP_REGIONS.has(r.region))
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
  return db.suburb.findMany({
    where: { region },
    select: {
      slug: true,
      name: true,
      postcode: true,
      state: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getRegionStats(region: string) {
  const suburbs = await db.suburb.findMany({
    where: { region },
    select: { medianHousePrice: true, annualGrowthHouse: true },
  });

  const prices  = suburbs.map((s) => s.medianHousePrice).filter((p) => p > 0);
  const growths = suburbs.map((s) => s.annualGrowthHouse).filter((g) => g != null) as number[];

  return {
    suburbCount: suburbs.length,
    medianHousePrice: prices.length
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : null,
    avgAnnualGrowth: growths.length
      ? parseFloat((growths.reduce((a, b) => a + b, 0) / growths.length).toFixed(1))
      : null,
  };
}
