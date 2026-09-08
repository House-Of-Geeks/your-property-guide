import { cache } from "react";
import { db } from "@/lib/db";

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
  medianRent3Bed: number | null;
  medianRent2Bed: number | null;
  medianRent1Bed: number | null;
  bondLodgements: number | null;
  source: string;
}

// Newest period first; on a tie the most recently written row (see the
// same ordering in suburb-service). Memoised per request: the rental-market
// page reads it in generateMetadata and again in the body.
export const getSuburbRentalHistory = cache(async (suburbSlug: string): Promise<SuburbRentalHistory[]> => {
  return db.suburbRentalStat.findMany({
    where: { suburbSlug },
    orderBy: [{ periodDate: "desc" }, { updatedAt: "desc" }],
  });
});

/** Suburbs that have at least one rental row: the rental-market sitemap gate. */
export async function getSuburbSlugsWithRentalData(): Promise<string[]> {
  const rows = await db.suburbRentalStat.findMany({
    where: { suburbSlug: { not: null } },
    distinct: ["suburbSlug"],
    select: { suburbSlug: true },
  });
  return rows.map((r) => r.suburbSlug as string);
}
