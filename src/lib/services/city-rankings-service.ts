import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { LOCALITIES_ONLY, NON_LOCALITY_SLUGS, NOT_PLACES_VERSION, isNonLocalitySlug } from "@/lib/non-localities";
import { PUBLISHED_GROWTH, PUBLISHED_HOUSE_MEDIAN, notInvertedMedians, publishedSales } from "@/lib/published-medians";
import { describeSalesProvenance } from "@/lib/sales-provenance";
import { WALK_SCORE_CAP, isRanked, type RankingCategory } from "@/lib/ranking-notes";
import { yieldFromSql, yieldStates } from "@/lib/services/suburb-rankings-service";
import { latestBondRents } from "@/lib/services/city-market-service";
import { passesHouseScreens } from "@/lib/median-coverage";
import { CAPITAL_CITIES, cityPostcodeSql, cityPostcodeWhere, getCapitalCity, kmToCbd, type CapitalCity } from "@/lib/utils/metro";
import {
  CITY_EDITION_CATEGORIES,
  CITY_EDITION_MIN_POPULATION,
  CITY_EDITION_POOL,
  CITY_EDITION_SIZE,
  PRICE_RANKED_CATEGORIES,
  editionCoverage,
  isCityEditionCategory,
  isCityEditionIndexable,
  type CityEdition,
  type CityEditionSuburb,
} from "@/lib/city-editions";

// The queries behind /best-suburbs/{category}/{city} (src/lib/city-editions.ts
// has the rules and the copy). Every price, change, rent and yield is what the
// suburb's own page publishes (src/lib/published-medians.ts, tracker item 47);
// a change is ranked only in the states whose feed measures one; the city is
// the postcode membership /property-market/{city} uses (cityPostcodeWhere).
// Queries run one after another: the runtime pool holds one connection.

type Row = {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  annualGrowthHouse: number;
  statsSource: string;
  salesCountHouse: number;
  walkScore: number | null;
  population: number;
  householdsFamily: number;
  lat: number | null;
  lng: number | null;
  salesUpdatedAt: Date | null;
  schools: { icsea: number | null }[];
};

const SELECT = {
  slug: true,
  name: true,
  state: true,
  postcode: true,
  medianHousePrice: true,
  medianUnitPrice: true,
  annualGrowthHouse: true,
  statsSource: true,
  salesCountHouse: true,
  walkScore: true,
  population: true,
  householdsFamily: true,
  lat: true,
  lng: true,
  salesUpdatedAt: true,
  schools: { select: { icsea: true } },
} as const;

function avgIcsea(schools: { icsea: number | null }[]): { avg: number | null; count: number } {
  const scores = schools.map((s) => s.icsea).filter((v): v is number => v != null);
  if (scores.length === 0) return { avg: null, count: 0 };
  return { avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length };
}

/** An edition row plus what the page's period line needs from the raw row. */
type Fetched = { suburb: CityEditionSuburb; statsSource: string; salesUpdatedAt: Date | null };

function toEditionSuburb(
  row: Row,
  city: CapitalCity,
  rent: { rent: number; period: Date | null; source: string | null; grossYield: number } | null,
): Fetched {
  return { suburb: editionSuburb(row, city, rent), statsSource: row.statsSource, salesUpdatedAt: row.salesUpdatedAt };
}

function editionSuburb(
  row: Row,
  city: CapitalCity,
  rent: { rent: number; period: Date | null; source: string | null; grossYield: number } | null,
): CityEditionSuburb {
  const sales = publishedSales(row);
  const icsea = avgIcsea(row.schools);
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    postcode: row.postcode,
    medianHousePrice: sales.medianHousePrice,
    medianUnitPrice: sales.medianUnitPrice,
    annualGrowthHouse: sales.annualGrowthHouse,
    medianBasis: sales.basis,
    population: row.population,
    householdsFamily: row.householdsFamily,
    walkScore: row.walkScore,
    avgSchoolIcsea: icsea.avg,
    schoolCount: icsea.count,
    medianRentHouse: rent?.rent ?? 0,
    rentPeriod: rent?.period ?? null,
    rentSource: rent?.source ?? null,
    grossRentalYield: rent ? parseFloat(rent.grossYield.toFixed(2)) : null,
    kmToCbd: kmToCbd(city, row),
  };
}

/** A name once per city: "Horsham" has a row for each of its postcodes. */
function dedupeByName<T>(rows: T[], name: (r: T) => string): T[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = name(r).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const baseWhere = (city: CapitalCity) => ({
  ...cityPostcodeWhere(city),
  ...LOCALITIES_ONLY,
  population: { gte: CITY_EDITION_MIN_POPULATION },
});

type YieldRow = Omit<Row, "schools"> & { rent: number; rentPeriod: Date | null; rentSource: string | null; grossYield: number };

const yieldFrom = (city: CapitalCity): string | null => {
  const states = yieldStates(city.state);
  return states.length === 0 ? null : yieldFromSql(states, cityPostcodeSql(city));
};

// notInvertedMedians: a row whose unit median is above its house median
// publishes neither (published-medians.hasInvertedMedians), so it is not
// counted or ranked either.
const growthWhere = (city: CapitalCity) => ({ ...baseWhere(city), ...PUBLISHED_GROWTH, ...notInvertedMedians(db.suburb.fields.medianHousePrice) });
const affordableWhere = (city: CapitalCity) => ({
  ...baseWhere(city),
  ...PUBLISHED_HOUSE_MEDIAN,
  ...notInvertedMedians(db.suburb.fields.medianHousePrice),
  medianHousePrice: { gt: 100000 },
});
const walkableWhere = (city: CapitalCity) => ({ ...baseWhere(city), walkScore: { gt: 0 } });
// Every family suburb in the city with a school ICSEA, ranked here on the
// average: the state ranking sorts the first 500 it finds (tracker item 49).
const familiesWhere = (city: CapitalCity) => ({
  ...baseWhere(city),
  householdsFamily: { gt: 40 },
  schools: { some: { icsea: { not: null } } },
});

/**
 * The cheapest list's whole pool, screened: every Greater {City} suburb with
 * a published median above $100,000 and 1,000 or more residents, less the
 * CBD-core postcodes and the apartment markets (src/lib/median-coverage.ts,
 * the July 2026 report's screens), cheapest first, a name once. The rent the
 * screen reads is the suburb's latest bond-data house rent. Read once per
 * request for the rows and the count.
 */
const screenedAffordable = cache(async (city: CapitalCity): Promise<Fetched[]> => {
  const rows = await db.suburb.findMany({
    where: affordableWhere(city),
    select: SELECT,
    orderBy: [{ medianHousePrice: "asc" }, { name: "asc" }],
  });
  const rents = await latestBondRents(rows.map((r) => r.slug));
  const kept = rows.filter((r) => passesHouseScreens(r, rents.get(r.slug)?.house));
  return dedupeByName(kept.map((r) => toEditionSuburb(r, city, null)), (r) => r.suburb.name);
});

/** The city's suburbs of 1,000 or more residents (a name once): the coverage floor's denominator. */
async function citySuburbCount(city: CapitalCity): Promise<number> {
  const rows = await db.suburb.findMany({ where: baseWhere(city), select: { name: true }, distinct: ["name"] });
  return rows.length;
}

/** The edition's rows, ranked, at most CITY_EDITION_POOL. Read by the page and by the sitemap list. */
async function fetchRows(category: RankingCategory, city: CapitalCity): Promise<Fetched[]> {
  if (!isCityEditionCategory(category) || !isRanked(category, city.state)) return [];
  const byName = (r: Fetched) => r.suburb.name;
  switch (category) {
    case "best-rental-yield": {
      const from = yieldFrom(city);
      if (!from) return [];
      // Fetched with room to spare, then the postal names dropped (their rows
      // carry figures of their own) and a name kept once.
      const fetched = await db.$queryRawUnsafe<YieldRow[]>(`
        SELECT
          s.slug, s.name, s.state, s.postcode,
          s."medianHousePrice", s."medianUnitPrice", s."annualGrowthHouse", s."statsSource", s."salesCountHouse",
          s."walkScore", s.population, s."householdsFamily", s.lat, s.lng, s."salesUpdatedAt",
          r.rent AS "rent", r."rentPeriod" AS "rentPeriod", r."rentSource" AS "rentSource",
          (r.rent * 52.0 / s."medianHousePrice" * 100) AS "grossYield"
        ${from}
        ORDER BY "grossYield" DESC, s.name ASC
        LIMIT ${CITY_EDITION_POOL * 2 + NON_LOCALITY_SLUGS.length}`);
      const rows = fetched.filter((r) => !isNonLocalitySlug(r.slug)).map((r) =>
        toEditionSuburb(
          {
            ...r,
            medianHousePrice: Number(r.medianHousePrice),
            medianUnitPrice: Number(r.medianUnitPrice),
            annualGrowthHouse: Number(r.annualGrowthHouse),
            salesCountHouse: Number(r.salesCountHouse),
            walkScore: r.walkScore != null ? Number(r.walkScore) : null,
            population: Number(r.population),
            householdsFamily: Number(r.householdsFamily),
            lat: r.lat != null ? Number(r.lat) : null,
            lng: r.lng != null ? Number(r.lng) : null,
            salesUpdatedAt: r.salesUpdatedAt ? new Date(r.salesUpdatedAt) : null,
            schools: [],
          },
          city,
          { rent: Number(r.rent), period: r.rentPeriod ? new Date(r.rentPeriod) : null, source: r.rentSource, grossYield: Number(r.grossYield) },
        ),
      );
      return dedupeByName(rows, byName).slice(0, CITY_EDITION_POOL);
    }

    case "highest-growth": {
      const rows = await db.suburb.findMany({
        where: growthWhere(city),
        select: SELECT,
        orderBy: [{ annualGrowthHouse: "desc" }, { name: "asc" }],
        take: CITY_EDITION_POOL * 2,
      });
      return dedupeByName(rows.map((r) => toEditionSuburb(r, city, null)), byName).slice(0, CITY_EDITION_POOL);
    }

    case "most-affordable":
      return (await screenedAffordable(city)).slice(0, CITY_EDITION_POOL);

    case "for-families": {
      const rows = await db.suburb.findMany({ where: familiesWhere(city), select: SELECT });
      const ranked = rows
        .map((r) => toEditionSuburb(r, city, null))
        .filter((r) => r.suburb.avgSchoolIcsea != null)
        .sort((a, b) => (b.suburb.avgSchoolIcsea ?? 0) - (a.suburb.avgSchoolIcsea ?? 0) || a.suburb.name.localeCompare(b.suburb.name));
      return dedupeByName(ranked, byName).slice(0, CITY_EDITION_POOL);
    }

    case "most-walkable": {
      const rows = await db.suburb.findMany({
        where: walkableWhere(city),
        select: SELECT,
        orderBy: [{ walkScore: "desc" }, { name: "asc" }],
        take: CITY_EDITION_POOL * 2,
      });
      return dedupeByName(rows.map((r) => toEditionSuburb(r, city, null)), byName).slice(0, CITY_EDITION_POOL);
    }

    default:
      return [];
  }
}

/** How many Greater {City} suburbs the ranking was drawn from, on the same filter as the rows. */
async function eligibleCount(category: RankingCategory, city: CapitalCity): Promise<number> {
  if (!isCityEditionCategory(category) || !isRanked(category, city.state)) return 0;
  switch (category) {
    case "best-rental-yield": {
      const from = yieldFrom(city);
      if (!from) return 0;
      const rows = await db.$queryRawUnsafe<{ n: bigint | number }[]>(`SELECT COUNT(*) AS n ${from}`);
      return Number(rows[0]?.n ?? 0);
    }
    case "highest-growth":
      return db.suburb.count({ where: growthWhere(city) });
    case "most-affordable":
      // The screened pool, a name once: what the ten were ranked from.
      return (await screenedAffordable(city)).length;
    case "for-families":
      return db.suburb.count({ where: familiesWhere(city) });
    case "most-walkable":
      return db.suburb.count({ where: walkableWhere(city) });
    default:
      return 0;
  }
}

/** The period the city's medians describe, from the feed's own record ("calendar 2025", "2024"). */
async function salesPeriodFor(city: CapitalCity, rows: Fetched[]): Promise<string | null> {
  // One state's rows, so one feed: the first row with a published median names it.
  const priced = rows.find((r) => r.suburb.medianHousePrice > 0);
  if (!priced) return null;
  const updated = rows
    .map((r) => r.salesUpdatedAt)
    .filter((d): d is Date => d != null)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  const feed = await db.dataSource.findUnique({ where: { id: priced.statsSource }, select: { dataAsOf: true } });
  return describeSalesProvenance({ source: priced.statsSource, periodEnd: feed?.dataAsOf ?? null, updatedAt: updated, salesCount: null, suburbName: city.name })?.period ?? null;
}

/** Walkable only: the eligible suburbs (a name once) tied at the capped walk score, which the score cannot order. */
async function atCapCount(city: CapitalCity): Promise<number> {
  const rows = await db.suburb.findMany({
    where: { ...walkableWhere(city), walkScore: { gte: WALK_SCORE_CAP } },
    select: { name: true },
    distinct: ["name"],
  });
  return rows.length;
}

async function fetchCityEdition(category: RankingCategory, city: CapitalCity): Promise<CityEdition> {
  // One after the other: the runtime pool holds a single connection.
  const rows = await fetchRows(category, city);
  const eligible = rows.length > 0 ? await eligibleCount(category, city) : 0;
  const salesPeriod = await salesPeriodFor(city, rows);
  const atCap = category === "most-walkable" && rows.length > 0 ? await atCapCount(city) : undefined;
  // The coverage floor's denominator, where a price ranking has ten to show.
  const citySuburbs = PRICE_RANKED_CATEGORIES.includes(category) && rows.length >= CITY_EDITION_SIZE ? await citySuburbCount(city) : null;
  return { category, city, suburbs: rows.map((r) => r.suburb), eligible, salesPeriod, atCap, citySuburbs };
}

/** One fetch per request: generateMetadata and the page share it. */
export const getCityEdition = cache(fetchCityEdition);

export interface IndexableCityEdition {
  category: RankingCategory;
  citySlug: string;
}

/**
 * The indexable city editions: the one list the city sitemap submits and the
 * state pages, the category pages and the editions link to. The same query
 * and the same predicate (isCityEditionIndexable: ten suburbs to show, on a
 * measure that ranks) as the page's own robots decision, cached for a day
 * like the other sitemap lists.
 */
export const getIndexableCityEditions = unstable_cache(
  async (): Promise<IndexableCityEdition[]> => {
    const out: IndexableCityEdition[] = [];
    for (const category of CITY_EDITION_CATEGORIES) {
      for (const city of CAPITAL_CITIES) {
        if (!isRanked(category, city.state)) continue;
        // The page's own edition query, and the page's own predicate on it.
        const edition = await fetchCityEdition(category, city);
        if (isCityEditionIndexable(category, city.state, edition.suburbs.length, editionCoverage(edition))) out.push({ category, citySlug: city.slug });
      }
    }
    return out;
  },
  ["best-suburbs-city-editions:v3", NOT_PLACES_VERSION],
  { revalidate: 86400, tags: ["sitemap-best-suburbs-cities"] },
);

/** The list for a page's link block: a failed read leaves the block empty rather than the page down, and is not cached. */
export async function indexableCityEditionsForLinks(): Promise<IndexableCityEdition[]> {
  try {
    return await getIndexableCityEditions();
  } catch (err) {
    console.error("[city-editions] could not list the indexable city editions", err);
    return [];
  }
}

export function cityEditionLinks(editions: IndexableCityEdition[], filter: { category?: RankingCategory; state?: string; citySlug?: string }): { category: RankingCategory; city: CapitalCity }[] {
  return editions
    .map((e) => ({ category: e.category, city: getCapitalCity(e.citySlug) }))
    .filter((e): e is { category: RankingCategory; city: CapitalCity } => e.city != null)
    .filter((e) => (filter.category ? e.category === filter.category : true))
    .filter((e) => (filter.state ? e.city.state === filter.state : true))
    .filter((e) => (filter.citySlug ? e.city.slug === filter.citySlug : true));
}
