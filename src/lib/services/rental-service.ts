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

export async function getSuburbRentalHistory(suburbSlug: string): Promise<SuburbRentalHistory[]> {
  return db.suburbRentalStat.findMany({
    where: { suburbSlug },
    orderBy: { periodDate: "desc" },
  });
}
