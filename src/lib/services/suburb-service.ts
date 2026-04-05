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
      ownerOccupied:        s.ownerOccupied,
      renterOccupied:       s.renterOccupied,
      householdsFamily:     s.householdsFamily,
      householdsLonePerson: s.householdsLonePerson,
    },
    schools: s.schools.map((sc) => ({
      name:      sc.name,
      type:      sc.type   as Suburb["schools"][number]["type"],
      sector:    sc.sector as Suburb["schools"][number]["sector"],
      distance:  sc.distance,
      yearRange: sc.yearRange ?? null,
      gender:    (sc.gender ?? null) as Suburb["schools"][number]["gender"],
      website:   sc.website ?? null,
      icsea:     sc.icsea ?? null,
      enrolment: sc.enrolment ?? null,
      acaraId:   sc.acaraId ?? null,
    })),
    amenities:      s.amenities,
    transportLinks: s.transportLinks,
    nearbySuburbs:  s.nearbySuburbs,
    dataFreshness:  freshness,
  };
}

const includeSchools = { schools: true };

export async function getSuburbs(): Promise<Suburb[]> {
  // No schools on listing pages — reduces payload significantly
  const rows = await db.suburb.findMany({ orderBy: { name: "asc" }, include: { schools: false } });
  return rows.map((s) => toSuburb({ ...s, schools: [] }, NO_FRESHNESS, null, null));
}

export async function getFeaturedSuburbs(limit = 6): Promise<Suburb[]> {
  // Only suburbs with real data (population > 0) for the home page spotlight
  const rows = await db.suburb.findMany({
    where: { population: { gt: 0 } },
    orderBy: { population: "desc" },
    take: limit,
    include: { schools: false },
  });
  return rows.map((s) => toSuburb({ ...s, schools: [] }, NO_FRESHNESS, null, null));
}

async function getNearbySchools(suburb: { id: string; lat: number | null; lng: number | null }): Promise<DbSchool[]> {
  if (!suburb.lat || !suburb.lng) {
    return db.school.findMany({ where: { suburbId: suburb.id } });
  }
  const lat = suburb.lat;
  const lng = suburb.lng;

  // Try progressively larger radii until we have enough schools
  for (const radiusKm of [10, 20, 40]) {
    const schools = await db.$queryRaw<DbSchool[]>`
      SELECT s.*,
        (6371 * acos(
          cos(radians(${lat})) * cos(radians(s.lat)) *
          cos(radians(s.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(s.lat))
        )) AS dist_km
      FROM "School" s
      WHERE s.lat IS NOT NULL AND s.lng IS NOT NULL
        AND (6371 * acos(
          cos(radians(${lat})) * cos(radians(s.lat)) *
          cos(radians(s.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(s.lat))
        )) <= ${radiusKm}
      ORDER BY dist_km ASC
      LIMIT 20
    `;
    // Stop expanding if we have at least one primary AND one secondary (or 5+ total)
    const hasSecondary = schools.some((s) => s.type === "secondary" || s.type === "combined");
    if (schools.length >= 5 || (schools.length >= 2 && hasSecondary)) return schools;
    if (radiusKm === 40) return schools; // last attempt, return whatever we have
  }
  return [];
}

export async function getSuburbBySlug(slug: string): Promise<Suburb | null> {
  const [row, { freshness, rentalRentHouse, rentalRentUnit }] = await Promise.all([
    db.suburb.findUnique({ where: { slug }, include: { schools: false } }),
    fetchFreshness(slug),
  ]);
  if (!row) return null;
  const schools = await getNearbySchools(row);
  return toSuburb({ ...row, schools }, freshness, rentalRentHouse, rentalRentUnit);
}

export async function getAllSuburbSlugs(): Promise<string[]> {
  const rows = await db.suburb.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
