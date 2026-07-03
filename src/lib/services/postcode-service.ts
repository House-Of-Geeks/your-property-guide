import { db } from "@/lib/db";
import { isPlausibleAnnualGrowth, isReliableSalesSource } from "@/lib/suburb-data-quality";

export interface PostcodeSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  annualGrowthHouse: number | null;
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
      statsSource: true,
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
  });

  // Order for display AND for the page title (which leads with the first
  // names). Population alone is not enough: PO-box/commercial localities
  // ("Parramatta Westfield") were outranking the real suburb in live
  // titles when the suburb's census row hadn't synced. Having schools is
  // a strong "real residential suburb" signal, so bucket those first,
  // then population, then school count, then name for determinism.
  const ordered = [...rows].sort(
    (a, b) =>
      (b.schools.length > 0 ? 1 : 0) - (a.schools.length > 0 ? 1 : 0) ||
      (b.population || 0) - (a.population || 0) ||
      b.schools.length - a.schools.length ||
      a.name.localeCompare(b.name),
  );

  // Same trust gate the suburb pages apply in suburb-service.toSuburb():
  // never surface the QLD/WA census-mortgage proxy or seed placeholders
  // as if they were real medians.
  return ordered.map(({ statsSource, ...s }) => {
    const reliable = isReliableSalesSource(statsSource);
    return {
      ...s,
      medianHousePrice: reliable ? s.medianHousePrice : 0,
      medianUnitPrice: reliable ? s.medianUnitPrice : 0,
      annualGrowthHouse:
        reliable && isPlausibleAnnualGrowth(s.annualGrowthHouse) ? s.annualGrowthHouse : null,
    };
  });
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
      statsSource: true,
      _count: { select: { schools: true } },
    },
  });

  // Only average price data from suburbs whose sales source passes the
  // trust gate — an average that mixes census-proxy fiction (sales-qld/wa,
  // seed) with real medians ends up in SERP meta descriptions as fact.
  const priced = suburbs.filter((s) => isReliableSalesSource(s.statsSource));
  const prices = priced.map((s) => s.medianHousePrice).filter((p) => p > 0);
  const unitPrices = priced.map((s) => s.medianUnitPrice).filter((p) => p > 0);
  const growths = priced
    .map((s) => s.annualGrowthHouse)
    .filter((g) => isPlausibleAnnualGrowth(g)) as number[];

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
