export interface SuburbRefreshDates {
  statsUpdatedAt?: Date | null;
  censusUpdatedAt?: Date | null;
  salesUpdatedAt?: Date | null;
  rentalUpdatedAt?: Date | null;
  raiUpdatedAt?: Date | null;
  crimeUpdatedAt?: Date | null;
  walkabilityUpdatedAt?: Date | null;
  climateUpdatedAt?: Date | null;
  hazardUpdatedAt?: Date | null;
}

/** The Suburb columns that record when a data feed last refreshed this suburb. */
export const SUBURB_REFRESH_COLUMNS = [
  "statsUpdatedAt",
  "censusUpdatedAt",
  "salesUpdatedAt",
  "rentalUpdatedAt",
  "raiUpdatedAt",
  "crimeUpdatedAt",
  "walkabilityUpdatedAt",
  "climateUpdatedAt",
  "hazardUpdatedAt",
] as const satisfies readonly (keyof SuburbRefreshDates)[];

/** Select clause for the refresh columns. */
export const SUBURB_REFRESH_SELECT = {
  statsUpdatedAt: true,
  censusUpdatedAt: true,
  salesUpdatedAt: true,
  rentalUpdatedAt: true,
  raiUpdatedAt: true,
  crimeUpdatedAt: true,
  walkabilityUpdatedAt: true,
  climateUpdatedAt: true,
  hazardUpdatedAt: true,
} as const;

/**
 * When a feed last refreshed this suburb's data: the latest non-null of the
 * per-type refresh columns. Null when none is set. Never falls back to the
 * row's updatedAt (every bulk write bumps it) or to the current time.
 */
export function suburbDataUpdatedAt(row: SuburbRefreshDates): Date | null {
  let latest: Date | null = null;
  for (const col of SUBURB_REFRESH_COLUMNS) {
    const d = row[col];
    if (d && !Number.isNaN(d.getTime()) && (!latest || d.getTime() > latest.getTime())) latest = d;
  }
  return latest;
}

const SYDNEY = "Australia/Sydney";

/** A date as the page shows it: ISO day (`2026-10-21`) and en-AU long date (`21 October 2026`), both in Australia/Sydney. */
export function formatUpdatedDate(d: Date | string): { iso: string; label: string } | null {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SYDNEY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const iso = `${get("year")}-${get("month")}-${get("day")}`;
  const label = new Intl.DateTimeFormat("en-AU", {
    timeZone: SYDNEY,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return { iso, label };
}
