import { db } from "@/lib/db";
import { publishedSales } from "@/lib/published-medians";
// Postal delivery names, institutions and shopping-centre post offices share
// postcodes with the suburbs around them but are not suburbs (LOCALITIES_ONLY).
// The page lists them separately, as what they are (getPostalNamesByPostcode).
// The two all-postcode lists below keep them: a postcode Australia Post uses
// only for a mail centre still has a page. They leave out the rows that are
// not even that (MISFILED_SLUGS) and anything that is not four digits: the
// postcode sitemap listed "872" and "NOT DISCLOSED" until 29 Sep 2026.
import { LOCALITIES_ONLY, MISFILED_SLUGS, nonLocalitiesInPostcode, type NonLocality } from "@/lib/non-localities";

const LISTED_POSTCODES = { slug: { notIn: MISFILED_SLUGS } };
const FOUR_DIGITS = /^\d{4}$/;

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

/** Delivery names Australia Post uses in this postcode; from the generated list, no query. */
export function getPostalNamesByPostcode(postcode: string): NonLocality[] {
  return nonLocalitiesInPostcode(postcode);
}

export async function getSuburbsByPostcode(postcode: string): Promise<PostcodeSuburb[]> {
  const rows = await db.suburb.findMany({
    where: { postcode, ...LOCALITIES_ONLY },
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
      salesCountHouse: true,
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

  // The rule the suburb pages apply in suburb-service.toSuburb(), read from
  // the same place (src/lib/published-medians.ts) and not copied: until
  // 29 Sep 2026 this checked the source but not the five-sale floor, so a
  // postcode page printed a median its suburb's own page withheld, and a
  // 12-month change of 0.0% where the feed had no earlier year to compare.
  return ordered.map(({ statsSource, salesCountHouse, ...s }) => {
    const sales = publishedSales({ ...s, statsSource, salesCountHouse });
    return {
      ...s,
      medianHousePrice: sales.medianHousePrice,
      medianUnitPrice: sales.medianUnitPrice,
      annualGrowthHouse: sales.annualGrowthHouse !== 0 ? sales.annualGrowthHouse : null,
    };
  });
}

export async function getAllPostcodes(): Promise<string[]> {
  const rows = await db.suburb.findMany({
    where: LISTED_POSTCODES,
    select: { postcode: true },
    orderBy: { postcode: "asc" },
  });
  // Deduplicate
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const r of rows) {
    if (FOUR_DIGITS.test(r.postcode) && !seen.has(r.postcode)) {
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
    where: LISTED_POSTCODES,
    select: { postcode: true, state: true },
    orderBy: [{ state: "asc" }, { postcode: "asc" }],
  });
  // Deduplicate by postcode, keep first state seen
  const seen = new Map<string, string>();
  for (const r of rows) {
    if (FOUR_DIGITS.test(r.postcode) && !seen.has(r.postcode)) {
      seen.set(r.postcode, r.state);
    }
  }
  return Array.from(seen.entries()).map(([postcode, state]) => ({ postcode, state }));
}

export async function getPostcodeStats(postcode: string): Promise<PostcodeStats> {
  const suburbs = await db.suburb.findMany({
    where: { postcode, ...LOCALITIES_ONLY },
    select: {
      medianHousePrice: true,
      medianUnitPrice: true,
      annualGrowthHouse: true,
      population: true,
      statsSource: true,
      salesCountHouse: true,
      _count: { select: { schools: true } },
    },
  });

  // Only average the figures the suburb pages publish: an average that mixes
  // census-proxy fiction (sales-qld/wa, seed) or a median of three sales with
  // real medians ends up in SERP meta descriptions as fact. A change of 0 is
  // "no earlier year to compare", not a flat year, and is left out.
  const published = suburbs.map(publishedSales);
  const prices = published.map((s) => s.medianHousePrice).filter((p) => p > 0);
  const unitPrices = published.map((s) => s.medianUnitPrice).filter((p) => p > 0);
  const growths = published.map((s) => s.annualGrowthHouse).filter((g) => g !== 0);

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
