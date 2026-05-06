import { db } from "@/lib/db";

export interface DataFreshness {
  id:            string;
  label:         string;
  lastFetchedAt: Date | null;
  dataAsOf:      Date | null;
  status:        string;
  recordCount:   number | null;
}

/** Get freshness info for all sources in a category */
export async function getFreshnessByCategory(category: string): Promise<DataFreshness[]> {
  return db.dataSource.findMany({
    where: { category },
    select: { id: true, label: true, lastFetchedAt: true, dataAsOf: true, status: true, recordCount: true },
    orderBy: { lastFetchedAt: "desc" },
  });
}

/** Get freshness for a specific source by ID */
export async function getSourceFreshness(id: string): Promise<DataFreshness | null> {
  return db.dataSource.findUnique({
    where: { id },
    select: { id: true, label: true, lastFetchedAt: true, dataAsOf: true, status: true, recordCount: true },
  });
}

/** Get the latest rental freshness for a given state */
export async function getRentalFreshness(state: string): Promise<DataFreshness | null> {
  const id = `rental-${state.toLowerCase()}`;
  return getSourceFreshness(id);
}

/** Get the latest crime freshness for a given state */
export async function getCrimeFreshness(state: string): Promise<DataFreshness | null> {
  const id = `crime-${state.toLowerCase()}`;
  return getSourceFreshness(id);
}

/** Get the latest rental stats for a suburb */
export async function getLatestSuburbRental(suburbSlug: string) {
  return db.suburbRentalStat.findFirst({
    where:   { suburbSlug },
    orderBy: { periodDate: "desc" },
  });
}

/** Get the latest crime stats for a suburb */
export async function getLatestSuburbCrime(suburbSlug: string) {
  return db.suburbCrimeStat.findFirst({
    where:   { suburbSlug },
    orderBy: { periodDate: "desc" },
  });
}

/**
 * Get the latest crime stats for a suburb, with fallback to LGA-level data
 * for states (QLD, NT) that only publish crime by LGA / Reporting Region.
 *
 * Lookup order:
 *   1. SuburbCrimeStat row matching this suburbSlug exactly.
 *   2. Failing that, look up SuburbCrimeStat by state + normalised lga name
 *      against the suburb's `region` field. Strips "City Council",
 *      "Regional Council", "Shire Council" suffixes from the LGA side so
 *      "Brisbane" matches "Brisbane City Council".
 */
export async function getSuburbCrimeWithLgaFallback(
  suburbSlug: string,
  state: string,
  region: string,
): Promise<{
  totalOffences: number;
  offenceBreakdown: unknown;
  period: string;
  state: string;
  geoLevel: "suburb" | "lga";
  lgaName?: string;
} | null> {
  // 1. Suburb-level
  const suburbStat = await db.suburbCrimeStat.findFirst({
    where: { suburbSlug },
    orderBy: { periodDate: "desc" },
  });
  if (suburbStat) {
    return {
      totalOffences: suburbStat.totalOffences,
      offenceBreakdown: suburbStat.offenceBreakdown,
      period: suburbStat.period,
      state: suburbStat.state,
      geoLevel: "suburb",
    };
  }

  // 2. LGA-level fallback. Only meaningful for states whose ingest stores
  //    suburbSlug=null + lga=name (currently QLD via crime-qld and NT via
  //    crime-nt). For other states this is a no-op.
  if (!region) return null;

  const normalize = (s: string): string =>
    s
      .toLowerCase()
      .replace(/\s+(city|regional|shire|aboriginal\s+shire)\s+council$/i, "")
      .replace(/\s+council$/i, "")
      .trim();

  const target = normalize(region);

  // Pull all LGA-level rows for the state and pick the closest name match.
  // The LGA list per state is small (QLD ~80, NT ~10) so this is cheap.
  const lgaRows = await db.suburbCrimeStat.findMany({
    where: { state, suburbSlug: null },
    orderBy: { periodDate: "desc" },
  });

  const match = lgaRows.find((r) => r.lga && normalize(r.lga) === target);
  if (!match) return null;

  return {
    totalOffences: match.totalOffences,
    offenceBreakdown: match.offenceBreakdown,
    period: match.period,
    state: match.state,
    geoLevel: "lga",
    lgaName: match.lga ?? undefined,
  };
}
