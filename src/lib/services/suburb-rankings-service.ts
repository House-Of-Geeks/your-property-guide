import { db } from "@/lib/db";

export type RankingCategory =
  | "for-families"
  | "highest-growth"
  | "most-affordable"
  | "most-walkable"
  | "lowest-flood-risk"
  | "best-rental-yield";

export interface RankedSuburb {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  medianHousePrice: number;
  medianUnitPrice: number;
  annualGrowthHouse: number;
  walkScore: number | null;
  population: number;
  medianRentHouse: number;
  ownerOccupied: number;
  householdsFamily: number;
  avgSchoolIcsea: number | null;
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
  walkScore: number | null;
  population: number;
  medianRentHouse: number;
  ownerOccupied: number;
  householdsFamily: number;
  schools: { icsea: number | null }[];
};

function computeAvgIcsea(schools: { icsea: number | null }[]): number | null {
  const scores = schools.map((s) => s.icsea).filter((v): v is number => v != null);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function computeGrossYield(rent: number, price: number): number | null {
  if (rent <= 0 || price <= 0) return null;
  return parseFloat(((rent * 52.0) / price * 100).toFixed(2));
}

const SUBURB_SELECT = {
  slug: true,
  name: true,
  state: true,
  postcode: true,
  medianHousePrice: true,
  medianUnitPrice: true,
  annualGrowthHouse: true,
  walkScore: true,
  population: true,
  medianRentHouse: true,
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
  const hazard = hazardMap.get(row.slug) ?? null;
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    postcode: row.postcode,
    medianHousePrice: row.medianHousePrice,
    medianUnitPrice: row.medianUnitPrice,
    annualGrowthHouse: row.annualGrowthHouse,
    walkScore: row.walkScore,
    population: row.population,
    medianRentHouse: row.medianRentHouse,
    ownerOccupied: row.ownerOccupied,
    householdsFamily: row.householdsFamily,
    avgSchoolIcsea: computeAvgIcsea(row.schools),
    grossRentalYield: computeGrossYield(row.medianRentHouse, row.medianHousePrice),
    hazard,
  };
}

export async function getRankedSuburbs(
  category: RankingCategory,
  state?: string,
  limit = 50
): Promise<RankedSuburb[]> {
  const stateFilter = state ? { state } : {};

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
        where: {
          ...stateFilter,
          annualGrowthHouse: { gt: 0 },
          medianHousePrice: { gt: 0 },
        },
        select: SUBURB_SELECT,
        orderBy: { annualGrowthHouse: "desc" },
        take: limit,
      });
      const hazardMap = await fetchHazardMap(rows.map((r) => r.slug));
      return rows.map((r) => buildRankedSuburb(r, hazardMap));
    }

    case "most-affordable": {
      const rows = await db.suburb.findMany({
        where: {
          ...stateFilter,
          medianHousePrice: { gt: 100000 },
        },
        select: SUBURB_SELECT,
        orderBy: { medianHousePrice: "asc" },
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

      // Fetch suburbs with low risk
      const lowRiskWhere = {
        ...stateFilter,
        slug: { in: lowRiskSlugs },
      };

      // Fetch suburbs with no hazard record (use NOT IN via $queryRawUnsafe or use a different approach)
      // Prisma doesn't support "has no related record" without a relation — use raw approach
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
      const deduped = [...new Set(allSlugs)];

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
      const stateClause = state
        ? `AND s.state = '${state.replace(/'/g, "''")}'`
        : "";
      type YieldRow = {
        slug: string;
        name: string;
        state: string;
        postcode: string;
        "medianHousePrice": number;
        "medianUnitPrice": number;
        "annualGrowthHouse": number;
        "walkScore": number | null;
        population: number;
        "medianRentHouse": number;
        "ownerOccupied": number;
        "householdsFamily": number;
        "grossYield": number;
      };
      const yieldRows = await db.$queryRawUnsafe<YieldRow[]>(`
        SELECT
          s.slug,
          s.name,
          s.state,
          s.postcode,
          s."medianHousePrice",
          s."medianUnitPrice",
          s."annualGrowthHouse",
          s."walkScore",
          s.population,
          s."medianRentHouse",
          s."ownerOccupied",
          s."householdsFamily",
          (s."medianRentHouse" * 52.0 / s."medianHousePrice" * 100) AS "grossYield"
        FROM "Suburb" s
        WHERE s."medianRentHouse" > 0
          AND s."medianHousePrice" > 0
          ${stateClause}
        ORDER BY "grossYield" DESC
        LIMIT ${limit}
      `);

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
        const hazard = hazardMap.get(r.slug) ?? null;
        const schools = schoolMap.get(r.slug) ?? [];
        return {
          slug: r.slug,
          name: r.name,
          state: r.state,
          postcode: r.postcode,
          medianHousePrice: Number(r["medianHousePrice"]),
          medianUnitPrice: Number(r["medianUnitPrice"]),
          annualGrowthHouse: Number(r["annualGrowthHouse"]),
          walkScore: r["walkScore"] != null ? Number(r["walkScore"]) : null,
          population: Number(r.population),
          medianRentHouse: Number(r["medianRentHouse"]),
          ownerOccupied: Number(r["ownerOccupied"]),
          householdsFamily: Number(r["householdsFamily"]),
          avgSchoolIcsea: computeAvgIcsea(schools),
          grossRentalYield: parseFloat(Number(r["grossYield"]).toFixed(2)),
          hazard,
        };
      });
    }

    default:
      return [];
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
    where: { state: upperState },
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
    where: { state: upperState, region: { not: "" } },
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
    where: { state: upperState, population: { gt: 0 } },
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
