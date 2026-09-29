import { db } from "@/lib/db";
import { LOCALITIES_ONLY, NON_LOCALITY_SLUGS, isNonLocalitySlug } from "@/lib/non-localities";
import {
  PUBLISHED_GROWTH,
  PUBLISHED_HOUSE_MEDIAN,
  PUBLISHED_HOUSE_MEDIAN_SQL,
  publishedSales,
  type MedianBasis,
} from "@/lib/published-medians";
import { MAX_PLAUSIBLE_GROSS_YIELD } from "@/lib/suburb-snapshot";
import { YIELD_MIN_POPULATION, YIELD_RANKED_STATES, type RankingCategory } from "@/lib/ranking-notes";

export type { RankingCategory };

// Every price, growth figure, rent and yield below is what the suburb's own
// page publishes (fix item 47). Until 29 Sep 2026 the rankings read the raw
// columns: "most affordable" led with medians back-calculated from 2021
// census mortgage repayments, and "highest growth" with +4,612.1%.

export interface RankedSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  /** 0 when the suburb's page publishes no median. */
  medianHousePrice: number;
  medianUnitPrice: number;
  /** 0 when there is no published 12-month change. */
  annualGrowthHouse: number;
  /** "area" for an ABS statistical-area median, shared by the suburbs in that area. */
  medianBasis: MedianBasis | null;
  walkScore: number | null;
  population: number;
  /** Weekly house rent from the suburb's latest bond-data row; 0 outside the yield ranking. */
  medianRentHouse: number;
  ownerOccupied: number;
  householdsFamily: number;
  avgSchoolIcsea: number | null;
  /** Only in the yield ranking. */
  grossRentalYield: number | null;
  hazard: {
    floodClass: string | null;
    bushfireRisk: string | null;
  } | null;
}

type DbSuburbRow = {
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
  ownerOccupied: number;
  householdsFamily: number;
  schools: { icsea: number | null }[];
};

function computeAvgIcsea(schools: { icsea: number | null }[]): number | null {
  const scores = schools.map((s) => s.icsea).filter((v): v is number => v != null);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

const SUBURB_SELECT = {
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
  ownerOccupied: true,
  householdsFamily: true,
  schools: { select: { icsea: true } },
} as const;

type HazardMap = Map<string, { floodClass: string | null; bushfireRisk: string | null }>;

async function fetchHazardMap(slugs: string[]): Promise<HazardMap> {
  if (slugs.length === 0) return new Map();
  const hazards = await db.suburbHazard.findMany({
    where: { suburbSlug: { in: slugs } },
    select: { suburbSlug: true, floodClass: true, bushfireRisk: true },
  });
  return new Map(hazards.map((h) => [h.suburbSlug, { floodClass: h.floodClass, bushfireRisk: h.bushfireRisk }]));
}

function buildRankedSuburb(row: DbSuburbRow, hazardMap: HazardMap): RankedSuburb {
  const sales = publishedSales(row);
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    postcode: row.postcode,
    medianHousePrice: sales.medianHousePrice,
    medianUnitPrice: sales.medianUnitPrice,
    annualGrowthHouse: sales.annualGrowthHouse,
    medianBasis: sales.basis,
    walkScore: row.walkScore,
    population: row.population,
    medianRentHouse: 0,
    ownerOccupied: row.ownerOccupied,
    householdsFamily: row.householdsFamily,
    avgSchoolIcsea: computeAvgIcsea(row.schools),
    grossRentalYield: null,
    hazard: hazardMap.get(row.slug) ?? null,
  };
}

const STATE_CODES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

/** The states a yield ranking covers for this request: the ranked states, or the one asked for if it is one of them. */
function yieldStates(state?: string): string[] {
  const ranked = YIELD_RANKED_STATES.filter((s) => STATE_CODES.includes(s));
  return state ? ranked.filter((s) => s === state) : ranked;
}

// A published median, a rent from the suburb's newest bond-data row, a
// population that makes a rental market, and a yield inside the clamp the
// suburb pages use. The state list is from YIELD_RANKED_STATES, never from
// the request.
function yieldFromSql(states: string[]): string {
  return `
        FROM "Suburb" s
        JOIN LATERAL (
          SELECT rs."medianRentHouse" AS rent
          FROM "SuburbRentalStat" rs
          WHERE rs."suburbSlug" = s.slug
          ORDER BY rs."periodDate" DESC, rs."updatedAt" DESC
          LIMIT 1
        ) r ON TRUE
        WHERE ${PUBLISHED_HOUSE_MEDIAN_SQL}
          AND s.state IN (${states.map((st) => `'${st}'`).join(", ")})
          AND s.population >= ${YIELD_MIN_POPULATION}
          AND r.rent > 0
          AND (r.rent * 52.0 / s."medianHousePrice" * 100) <= ${MAX_PLAUSIBLE_GROSS_YIELD}`;
}

export async function getRankedSuburbs(
  category: RankingCategory,
  state?: string,
  limit = 50
): Promise<RankedSuburb[]> {
  // Postal delivery names and institutions are not suburbs to rank. Their
  // rows carry seed figures (a walk score of 100, a census-proxy median), so
  // without this they place: nine of the national most-walkable fifty on
  // 29 Sep 2026, "HMAS Kuttabul" and "Bondi Junction Plaza" among them.
  const stateFilter = { ...(state ? { state } : {}), ...LOCALITIES_ONLY };

  switch (category) {
    case "for-families": {
      const rows = await db.suburb.findMany({
        where: {
          ...stateFilter,
          householdsFamily: { gt: 40 },
        },
        select: SUBURB_SELECT,
        take: limit * 10,
      });
      const hazardMap = await fetchHazardMap(rows.map((r) => r.slug));
      const mapped = rows.map((r) => buildRankedSuburb(r, hazardMap));
      mapped.sort((a, b) => (b.avgSchoolIcsea ?? 0) - (a.avgSchoolIcsea ?? 0));
      return mapped.slice(0, limit);
    }

    case "highest-growth": {
      const rows = await db.suburb.findMany({
        where: { ...stateFilter, ...PUBLISHED_GROWTH },
        select: SUBURB_SELECT,
        orderBy: [{ annualGrowthHouse: "desc" }, { name: "asc" }],
        take: limit,
      });
      const hazardMap = await fetchHazardMap(rows.map((r) => r.slug));
      return rows.map((r) => buildRankedSuburb(r, hazardMap));
    }

    case "most-affordable": {
      const rows = await db.suburb.findMany({
        where: {
          ...stateFilter,
          ...PUBLISHED_HOUSE_MEDIAN,
          medianHousePrice: { gt: 100000 },
        },
        select: SUBURB_SELECT,
        orderBy: [{ medianHousePrice: "asc" }, { name: "asc" }],
        take: limit,
      });
      const hazardMap = await fetchHazardMap(rows.map((r) => r.slug));
      return rows.map((r) => buildRankedSuburb(r, hazardMap));
    }

    case "most-walkable": {
      const rows = await db.suburb.findMany({
        where: {
          ...stateFilter,
          walkScore: { gt: 0 },
        },
        select: SUBURB_SELECT,
        orderBy: { walkScore: "desc" },
        take: limit,
      });
      const hazardMap = await fetchHazardMap(rows.map((r) => r.slug));
      return rows.map((r) => buildRankedSuburb(r, hazardMap));
    }

    case "lowest-flood-risk": {
      // Get slugs of suburbs that have a hazard record with floodClass = 'low'
      const lowRiskHazards = await db.suburbHazard.findMany({
        where: { floodClass: "low" },
        select: { suburbSlug: true, floodClass: true, bushfireRisk: true },
      });
      const lowRiskSlugs = lowRiskHazards.map((h) => h.suburbSlug);
      const hazardMap: HazardMap = new Map(
        lowRiskHazards.map((h) => [h.suburbSlug, { floodClass: h.floodClass, bushfireRisk: h.bushfireRisk }])
      );

      // Fetch suburbs with no hazard record (use NOT IN via $queryRawUnsafe or use a different approach)
      // Prisma doesn't support "has no related record" without a relation, use raw approach
      const stateClause = state ? `AND s.state = '${state.replace(/'/g, "''")}'` : "";

      type SlugRow = { slug: string };
      const noHazardSlugs = await db.$queryRawUnsafe<SlugRow[]>(`
        SELECT s.slug FROM "Suburb" s
        WHERE NOT EXISTS (
          SELECT 1 FROM "SuburbHazard" h WHERE h."suburbSlug" = s.slug
        )
        ${stateClause}
        LIMIT ${limit}
      `);

      const allSlugs = [...lowRiskSlugs, ...noHazardSlugs.map((r) => r.slug)];
      // `slug: { in }` below replaces the filter in stateFilter, so the
      // list is filtered here.
      const deduped = [...new Set(allSlugs)].filter((s) => !isNonLocalitySlug(s));

      if (deduped.length === 0) return [];

      const rows = await db.suburb.findMany({
        where: { ...stateFilter, slug: { in: deduped } },
        select: SUBURB_SELECT,
        orderBy: { walkScore: "desc" },
        take: limit,
      });

      return rows.map((r) => buildRankedSuburb(r, hazardMap));
    }

    case "best-rental-yield": {
      const states = yieldStates(state);
      if (states.length === 0) return [];
      type YieldRow = {
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
        ownerOccupied: number;
        householdsFamily: number;
        rent: number;
        grossYield: number;
      };
      const fetched = await db.$queryRawUnsafe<YieldRow[]>(`
        SELECT
          s.slug,
          s.name,
          s.state,
          s.postcode,
          s."medianHousePrice",
          s."medianUnitPrice",
          s."annualGrowthHouse",
          s."statsSource",
          s."salesCountHouse",
          s."walkScore",
          s.population,
          s."ownerOccupied",
          s."householdsFamily",
          r.rent AS "rent",
          (r.rent * 52.0 / s."medianHousePrice" * 100) AS "grossYield"
        ${yieldFromSql(states)}
        ORDER BY "grossYield" DESC, s.name ASC
        LIMIT ${limit * 2 + NON_LOCALITY_SLUGS.length}
      `);
      // Fetched with room to spare, then the postal names dropped and a name
      // kept once per state: "Horsham" has a row for each of its postcodes.
      const seen = new Set<string>();
      const yieldRows = fetched
        .filter((r) => !isNonLocalitySlug(r.slug))
        .filter((r) => {
          const key = `${r.name.toLowerCase()}|${r.state}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, limit);

      const slugs = yieldRows.map((r) => r.slug);
      const [hazardMap, schoolRows] = await Promise.all([
        fetchHazardMap(slugs),
        db.school.findMany({
          where: { suburb: { slug: { in: slugs } } },
          select: { icsea: true, suburb: { select: { slug: true } } },
        }),
      ]);

      const schoolMap = new Map<string, { icsea: number | null }[]>();
      for (const sc of schoolRows) {
        const s = sc.suburb.slug;
        const arr = schoolMap.get(s) ?? [];
        arr.push({ icsea: sc.icsea });
        schoolMap.set(s, arr);
      }

      return yieldRows.map((r) => {
        const ranked = buildRankedSuburb(
          {
            ...r,
            medianHousePrice: Number(r.medianHousePrice),
            medianUnitPrice: Number(r.medianUnitPrice),
            annualGrowthHouse: Number(r.annualGrowthHouse),
            salesCountHouse: Number(r.salesCountHouse),
            walkScore: r.walkScore != null ? Number(r.walkScore) : null,
            population: Number(r.population),
            ownerOccupied: Number(r.ownerOccupied),
            householdsFamily: Number(r.householdsFamily),
            schools: schoolMap.get(r.slug) ?? [],
          },
          hazardMap,
        );
        return {
          ...ranked,
          medianRentHouse: Number(r.rent),
          grossRentalYield: parseFloat(Number(r.grossYield).toFixed(2)),
        };
      });
    }

    default:
      return [];
  }
}

/**
 * How many suburbs a ranking on a published figure was drawn from; null for
 * a ranking on something else (schools, walkability, flood class). The page
 * prints it beside the list.
 */
export async function getRankingEligibleCount(category: RankingCategory, state?: string): Promise<number | null> {
  const stateFilter = { ...(state ? { state } : {}), ...LOCALITIES_ONLY };
  switch (category) {
    case "highest-growth":
      return db.suburb.count({ where: { ...stateFilter, ...PUBLISHED_GROWTH } });
    case "most-affordable":
      return db.suburb.count({ where: { ...stateFilter, ...PUBLISHED_HOUSE_MEDIAN, medianHousePrice: { gt: 100000 } } });
    case "best-rental-yield": {
      const states = yieldStates(state);
      if (states.length === 0) return 0;
      const rows = await db.$queryRawUnsafe<{ n: bigint | number }[]>(`SELECT COUNT(*) AS n ${yieldFromSql(states)}`);
      return Number(rows[0]?.n ?? 0);
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// State stats
// ---------------------------------------------------------------------------

export interface StateStats {
  state: string;
  stateName: string;
  suburbCount: number;
  avgMedianHousePrice: number | null;
  avgAnnualGrowth: number | null;
}

const STATE_NAMES: Record<string, string> = {
  QLD: "Queensland",
  NSW: "New South Wales",
  VIC: "Victoria",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export function getStateName(state: string): string {
  return STATE_NAMES[state.toUpperCase()] ?? state;
}

export async function getStateStats(state: string): Promise<StateStats> {
  const upperState = state.toUpperCase();
  const rows = await db.suburb.findMany({
    where: { state: upperState, ...LOCALITIES_ONLY },
    select: { medianHousePrice: true, annualGrowthHouse: true },
  });

  const prices = rows.map((r) => r.medianHousePrice).filter((p) => p > 0);
  const growths = rows
    .map((r) => r.annualGrowthHouse)
    .filter((g) => g != null && g !== 0) as number[];

  return {
    state: upperState,
    stateName: getStateName(upperState),
    suburbCount: rows.length,
    avgMedianHousePrice: prices.length
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : null,
    avgAnnualGrowth: growths.length
      ? parseFloat((growths.reduce((a, b) => a + b, 0) / growths.length).toFixed(1))
      : null,
  };
}

export async function getStateRegions(
  state: string
): Promise<{ region: string; slug: string; suburbCount: number }[]> {
  const upperState = state.toUpperCase();
  const rows = await db.suburb.groupBy({
    by: ["region"],
    where: { state: upperState, region: { not: "" }, ...LOCALITIES_ONLY },
    _count: { slug: true },
    orderBy: { region: "asc" },
  });

  const SKIP = new Set([
    "Queensland",
    "New South Wales",
    "Victoria",
    "Western Australia",
    "South Australia",
    "Tasmania",
    "Northern Territory",
    "Australian Capital Territory",
    "No usual address",
    "Migratory - Offshore - Shipping",
    "Not Applicable",
  ]);

  return rows
    .filter((r) => r.region && !SKIP.has(r.region))
    .map((r) => ({
      region: r.region,
      slug: r.region
        .toLowerCase()
        .replace(/\s*-\s*/g, "-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      suburbCount: r._count.slug,
    }));
}

export async function getTopSuburbsByState(state: string, limit = 12) {
  const upperState = state.toUpperCase();
  return db.suburb.findMany({
    where: { state: upperState, population: { gt: 0 }, ...LOCALITIES_ONLY },
    select: {
      slug: true,
      name: true,
      postcode: true,
      state: true,
      region: true,
      medianHousePrice: true,
      annualGrowthHouse: true,
      population: true,
    },
    orderBy: { population: "desc" },
    take: limit,
  });
}

export async function getAllStatesWithStats(): Promise<StateStats[]> {
  const states = Object.keys(STATE_NAMES);
  return Promise.all(states.map((s) => getStateStats(s)));
}

export interface ComparisonPair {
  aSlug: string;
  aName: string;
  bSlug: string;
  bName: string;
  state: string;
  postcode: string;
}

/**
 * Top suburb-vs-suburb comparison pairs for a given state, used by the
 * /compare hub and by the compare sitemap to surface real comparisons
 * for SEO. Pairs are seeded from the populous suburbs in the state +
 * their nearby suburbs, deduplicated lexicographically so we don't emit
 * both "A vs B" and "B vs A".
 *
 * Only suburbs that actually exist in the DB are returned, the
 * nearbySuburbs array can include slugs that haven't been imported yet.
 */
export async function getTopComparisonPairsByState(
  state: string,
  limit = 12,
): Promise<ComparisonPair[]> {
  const upperState = state.toUpperCase();
  const tops = await db.suburb.findMany({
    where: { state: upperState, population: { gt: 0 }, ...LOCALITIES_ONLY },
    select: { slug: true, name: true, postcode: true, nearbySuburbs: true },
    orderBy: { population: "desc" },
    take: Math.max(limit, 40), // need a buffer for dedup + missing-neighbour filtering
  });

  // Collect all neighbour slugs referenced, then check which exist
  const candidateNeighbourSlugs = new Set<string>();
  // "Port Macquarie vs Port Macquarie BC" compared a town with its own
  // mail centre: 50 such pairs were in the comparison sitemap on 29 Sep 2026.
  for (const s of tops) {
    for (const n of s.nearbySuburbs) if (!isNonLocalitySlug(n)) candidateNeighbourSlugs.add(n);
  }

  const existingNeighbours = await db.suburb.findMany({
    where: { slug: { in: Array.from(candidateNeighbourSlugs) } },
    select: { slug: true, name: true, postcode: true },
  });
  const neighbourMap = new Map(existingNeighbours.map((s) => [s.slug, s]));

  const seen = new Set<string>();
  const pairs: ComparisonPair[] = [];

  for (const a of tops) {
    for (const bSlug of a.nearbySuburbs) {
      const b = neighbourMap.get(bSlug);
      if (!b) continue;
      // Canonical key, lexicographic, so we only emit each pair once
      const key = [a.slug, b.slug].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      // Emit in the order they appear (a is the more-populous suburb, which
      // makes "A vs B" read naturally e.g. "Sydney vs Bondi")
      pairs.push({
        aSlug: a.slug, aName: a.name,
        bSlug: b.slug, bName: b.name,
        state: upperState,
        postcode: a.postcode,
      });
      if (pairs.length >= limit) return pairs;
    }
  }

  return pairs;
}
