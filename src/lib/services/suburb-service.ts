import type { Suburb, SuburbDataFreshness } from "@/types";
import { db } from "@/lib/db";
import type { Suburb as DbSuburb, School as DbSchool } from "@/generated/prisma/client";

type DbSuburbWithSchools = DbSuburb & { schools: DbSchool[] };

const NO_FRESHNESS: SuburbDataFreshness = {
  rentalAsOf:   null,
  rentalSource: null,
  crimeAsOf:    null,
  crimeSource:  null,
};

async function fetchFreshness(slug: string): Promise<{
  freshness: SuburbDataFreshness;
  rentalRentHouse: number | null;
  rentalRentUnit:  number | null;
}> {
  const [rental, crime] = await Promise.all([
    db.suburbRentalStat.findFirst({
      where:   { suburbSlug: slug },
      orderBy: { periodDate: "desc" },
      select:  { periodDate: true, source: true, medianRentHouse: true, medianRentUnit: true },
    }),
    db.suburbCrimeStat.findFirst({
      where:   { suburbSlug: slug },
      orderBy: { periodDate: "desc" },
      select:  { periodDate: true, source: true },
    }),
  ]);

  return {
    freshness: {
      rentalAsOf:   rental?.periodDate ?? null,
      rentalSource: rental?.source    ?? null,
      crimeAsOf:    crime?.periodDate ?? null,
      crimeSource:  crime?.source     ?? null,
    },
    rentalRentHouse: rental?.medianRentHouse ?? null,
    rentalRentUnit:  rental?.medianRentUnit  ?? null,
  };
}

function toSuburb(s: DbSuburbWithSchools, freshness: SuburbDataFreshness, rentalRentHouse: number | null, rentalRentUnit: number | null): Suburb {
  return {
    id:          s.id,
    slug:        s.slug,
    name:        s.name,
    postcode:    s.postcode,
    state:       s.state,
    region:      s.region,
    description: s.description,
    heroImage:   s.heroImage,
    stats: {
      medianHousePrice:  s.medianHousePrice,
      medianUnitPrice:   s.medianUnitPrice,
      // Use synced rental data if available, otherwise fall back to seed value
      medianRentHouse:   rentalRentHouse ?? s.medianRentHouse,
      medianRentUnit:    rentalRentUnit  ?? s.medianRentUnit,
      annualGrowthHouse: s.annualGrowthHouse,
      annualGrowthUnit:  s.annualGrowthUnit,
      daysOnMarket:      s.daysOnMarket,
      population:        s.population,
      medianAge:         s.medianAge,
      ownerOccupied:     s.ownerOccupied,
      renterOccupied:    s.renterOccupied,
    },
    schools: s.schools.map((sc) => ({
      name:     sc.name,
      type:     sc.type   as Suburb["schools"][number]["type"],
      sector:   sc.sector as Suburb["schools"][number]["sector"],
      distance: sc.distance,
    })),
    amenities:      s.amenities,
    transportLinks: s.transportLinks,
    nearbySuburbs:  s.nearbySuburbs,
    dataFreshness:  freshness,
  };
}

const includeSchools = { schools: true };

export async function getSuburbs(): Promise<Suburb[]> {
  const rows = await db.suburb.findMany({ orderBy: { name: "asc" }, include: includeSchools });
  // For listing pages we don't need freshness — use empty freshness for performance
  return rows.map((s) => toSuburb(s, NO_FRESHNESS, null, null));
}

export async function getSuburbBySlug(slug: string): Promise<Suburb | null> {
  const [row, { freshness, rentalRentHouse, rentalRentUnit }] = await Promise.all([
    db.suburb.findUnique({ where: { slug }, include: includeSchools }),
    fetchFreshness(slug),
  ]);
  return row ? toSuburb(row, freshness, rentalRentHouse, rentalRentUnit) : null;
}

export async function getAllSuburbSlugs(): Promise<string[]> {
  const rows = await db.suburb.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
