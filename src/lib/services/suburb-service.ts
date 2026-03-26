import type { Suburb } from "@/types";
import { db } from "@/lib/db";
import type { Suburb as DbSuburb, School as DbSchool } from "@/generated/prisma";

type DbSuburbWithSchools = DbSuburb & { schools: DbSchool[] };

function toSuburb(s: DbSuburbWithSchools): Suburb {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    postcode: s.postcode,
    state: s.state,
    region: s.region,
    description: s.description,
    heroImage: s.heroImage,
    stats: {
      medianHousePrice: s.medianHousePrice,
      medianUnitPrice: s.medianUnitPrice,
      medianRentHouse: s.medianRentHouse,
      medianRentUnit: s.medianRentUnit,
      annualGrowthHouse: s.annualGrowthHouse,
      annualGrowthUnit: s.annualGrowthUnit,
      daysOnMarket: s.daysOnMarket,
      population: s.population,
      medianAge: s.medianAge,
      ownerOccupied: s.ownerOccupied,
      renterOccupied: s.renterOccupied,
    },
    schools: s.schools.map((sc) => ({
      name: sc.name,
      type: sc.type as Suburb["schools"][number]["type"],
      sector: sc.sector as Suburb["schools"][number]["sector"],
      distance: sc.distance,
    })),
    amenities: s.amenities,
    transportLinks: s.transportLinks,
    nearbySuburbs: s.nearbySuburbs,
  };
}

const includeSchools = { schools: true };

export async function getSuburbs(): Promise<Suburb[]> {
  const rows = await db.suburb.findMany({ orderBy: { name: "asc" }, include: includeSchools });
  return rows.map(toSuburb);
}

export async function getSuburbBySlug(slug: string): Promise<Suburb | null> {
  const row = await db.suburb.findUnique({ where: { slug }, include: includeSchools });
  return row ? toSuburb(row) : null;
}

export async function getAllSuburbSlugs(): Promise<string[]> {
  const rows = await db.suburb.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
