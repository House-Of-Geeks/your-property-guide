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
