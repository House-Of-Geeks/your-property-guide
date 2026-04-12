import { db } from "@/lib/db";

export interface PostcodeSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  annualGrowthHouse: number;
  population: number;
  schools: {
    name: string;
    type: string;
    sector: string;
    icsea: number | null;
    acaraId: string | null;
    website: string | null;
    yearRange: string | null;
  }[];
}

export interface PostcodeStats {
  avgMedianHousePrice: number | null;
  avgMedianUnitPrice: number | null;
  avgAnnualGrowthHouse: number | null;
  totalPopulation: number;
  totalSchoolCount: number;
}

export async function getSuburbsByPostcode(postcode: string): Promise<PostcodeSuburb[]> {
  const rows = await db.suburb.findMany({
    where: { postcode },
    select: {
      slug: true,
      name: true,
      state: true,
      postcode: true,
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
      population: true,
      schools: {
        select: {
          name: true,
          type: true,
          sector: true,
          icsea: true,
          acaraId: true,
          website: true,
          yearRange: true,
        },
      },
    },
    orderBy: { population: "desc" },
  });
  return rows;
}

export async function getAllPostcodes(): Promise<string[]> {
  const rows = await db.suburb.findMany({
    select: { postcode: true },
    orderBy: { postcode: "asc" },
  });
  // Deduplicate
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const r of rows) {
    if (r.postcode && !seen.has(r.postcode)) {
      seen.add(r.postcode);
      unique.push(r.postcode);
    }
  }
  return unique;
}

export interface PostcodeWithState {
  postcode: string;
  state: string;
}

export async function getAllPostcodesWithState(): Promise<PostcodeWithState[]> {
  const rows = await db.suburb.findMany({
    select: { postcode: true, state: true },
    orderBy: [{ state: "asc" }, { postcode: "asc" }],
  });
  // Deduplicate by postcode, keep first state seen
  const seen = new Map<string, string>();
  for (const r of rows) {
    if (r.postcode && !seen.has(r.postcode)) {
      seen.set(r.postcode, r.state);
    }
  }
  return Array.from(seen.entries()).map(([postcode, state]) => ({ postcode, state }));
}

export async function getPostcodeStats(postcode: string): Promise<PostcodeStats> {
  const suburbs = await db.suburb.findMany({
    where: { postcode },
    select: {
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
      population: true,
      _count: { select: { schools: true } },
    },
  });

  const prices = suburbs.map((s) => s.medianHousePrice).filter((p) => p > 0);
  const unitPrices = suburbs.map((s) => s.medianUnitPrice).filter((p) => p > 0);
  const growths = suburbs.map((s) => s.annualGrowthHouse).filter((g) => g != null) as number[];

  return {
    avgMedianHousePrice: prices.length
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : null,
    avgMedianUnitPrice: unitPrices.length
      ? Math.round(unitPrices.reduce((a, b) => a + b, 0) / unitPrices.length)
      : null,
    avgAnnualGrowthHouse: growths.length
      ? parseFloat((growths.reduce((a, b) => a + b, 0) / growths.length).toFixed(1))
      : null,
    totalPopulation: suburbs.reduce((sum, s) => sum + s.population, 0),
    totalSchoolCount: suburbs.reduce((sum, s) => sum + s._count.schools, 0),
  };
}
