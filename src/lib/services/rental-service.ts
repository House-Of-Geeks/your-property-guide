import { cache } from "react";
import { db } from "@/lib/db";
import { isNonLocalitySlug } from "@/lib/non-localities";

export interface SuburbRentalHistory {
  id: string;
  suburbSlug: string | null;
  suburbName: string;
  postcode: string;
  state: string;
  period: string;
  periodDate: Date;
  medianRentHouse: number | null;
  medianRentUnit: number | null;
  /** All dwellings together (WA bond data). Absent where the column does not exist yet. */
  medianRentAll?: number | null;
  medianRent3Bed: number | null;
  medianRent2Bed: number | null;
  medianRent1Bed: number | null;
  bondLodgements: number | null;
  source: string;
}

// ── The medianRentAll column ────────────────────────────────────────────────
//
// SuburbRentalStat.medianRentAll arrives with a hand-applied DDL
// (scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql), which may
// run after this code is deployed. A read that names a column the database
// lacks fails (Prisma P2022), and the rental history and the suburb service
// read this table on every rental-market and suburb page. So every read that
// names the column goes through withRentAllColumn: it tries with the column,
// and on that one error runs the read without it. A missing column is
// remembered for a minute, then tried again, so the column is picked up
// within a minute of the DDL without a redeploy; the feed that fills it
// (rental-wa) cannot write before the column exists.

export const RENT_ALL_RETRY_MS = 60_000;
let rentAllMissingAt: number | null = null;

export function isMissingColumnError(err: unknown, column = "medianRentAll"): boolean {
  const e = err as { code?: unknown; message?: unknown; meta?: unknown } | null;
  if (!e || typeof e !== "object") return false;
  if (e.code === "P2022") return true;
  const text = `${String(e.message ?? "")} ${JSON.stringify(e.meta ?? "")}`;
  return text.includes(column) && /does not exist|column.*not.*found|42703/i.test(text);
}

/** Test hook: forget what the last read found. */
export function resetRentAllColumnState(): void {
  rentAllMissingAt = null;
}

export async function withRentAllColumn<T>(read: (withAll: boolean) => Promise<T>, now: () => number = Date.now): Promise<T> {
  if (rentAllMissingAt === null || now() - rentAllMissingAt >= RENT_ALL_RETRY_MS) {
    try {
      const out = await read(true);
      rentAllMissingAt = null;
      return out;
    } catch (err) {
      if (!isMissingColumnError(err)) throw err;
      rentAllMissingAt = now();
    }
  }
  return read(false);
}

/** Every column of a rental row except medianRentAll, which the caller adds as `medianRentAll: withAll`. */
export const RENTAL_ROW_SELECT = {
  id: true,
  suburbSlug: true,
  suburbName: true,
  postcode: true,
  state: true,
  period: true,
  periodDate: true,
  medianRentHouse: true,
  medianRentUnit: true,
  medianRent3Bed: true,
  medianRent2Bed: true,
  medianRent1Bed: true,
  bondLodgements: true,
  source: true,
} as const;

// Newest period first; on a tie the most recently written row (see the
// same ordering in suburb-service). Memoised per request: the rental-market
// page reads it in generateMetadata and again in the body.
export const getSuburbRentalHistory = cache(async (suburbSlug: string): Promise<SuburbRentalHistory[]> => {
  return withRentAllColumn((withAll) =>
    db.suburbRentalStat.findMany({
      where: { suburbSlug },
      orderBy: [{ periodDate: "desc" }, { updatedAt: "desc" }],
      select: { ...RENTAL_ROW_SELECT, medianRentAll: withAll },
    }),
  );
});

/** Suburbs that have at least one rental row: the rental-market sitemap gate. */
export async function getSuburbSlugsWithRentalData(): Promise<string[]> {
  const rows = await db.suburbRentalStat.findMany({
    where: { suburbSlug: { not: null } },
    distinct: ["suburbSlug"],
    select: { suburbSlug: true },
  });
  return rows.map((r) => r.suburbSlug as string).filter((slug) => !isNonLocalitySlug(slug));
}
