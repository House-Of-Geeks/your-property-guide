import { db } from "@/lib/db";

// Static region config — add new regions here as data is populated
export const REGIONS: Record<string, {
  name: string;
  state: string;
  dbRegion: string; // matches suburb.region field in DB
  description: string;
}> = {
  "moreton-bay": {
    name: "Moreton Bay",
    state: "QLD",
    dbRegion: "Moreton Bay",
    description:
      "Moreton Bay is one of Queensland's fastest-growing regions, stretching from Brisbane's northern suburbs to the Sunshine Coast. The region offers a mix of coastal communities, established family suburbs, and new growth areas, with strong infrastructure investment and competitive property prices compared to inner Brisbane.",
  },
};

export type RegionConfig = (typeof REGIONS)[string] & { slug: string };

export function getRegionConfig(slug: string): RegionConfig | null {
  const config = REGIONS[slug];
  if (!config) return null;
  return { ...config, slug };
}

export function getAllRegionSlugs(): string[] {
  return Object.keys(REGIONS);
}

export async function getRegionSuburbs(dbRegion: string) {
  return db.suburb.findMany({
    where: { region: dbRegion },
    select: {
      slug: true,
      name: true,
      postcode: true,
      state: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
      heroImage: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getRegionStats(dbRegion: string) {
  const suburbs = await db.suburb.findMany({
    where: { region: dbRegion },
    select: {
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
    },
  });

  const prices = suburbs.map((s) => s.medianHousePrice).filter((p) => p > 0);
  const growths = suburbs.map((s) => s.annualGrowthHouse).filter((g) => g !== null) as number[];

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
