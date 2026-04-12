import { db } from "@/lib/db";
import { makeSchoolSlug } from "@/lib/utils/school";
export { makeSchoolSlug } from "@/lib/utils/school";

function parseAcaraId(slug: string): string | null {
  const parts = slug.split("-");
  const last = parts[parts.length - 1];
  return /^\d+$/.test(last) ? last : null;
}

export type SchoolWithSuburb = Awaited<ReturnType<typeof getSchoolBySlug>>;

export async function getSchoolBySlug(slug: string) {
  const acaraId = parseAcaraId(slug);
  if (!acaraId) return null;

  return db.school.findUnique({
    where: { acaraId },
    include: { suburb: { select: { slug: true, name: true, state: true, postcode: true, medianHousePrice: true } } },
  });
}

export async function getAllSchoolSlugs(): Promise<string[]> {
  const schools = await db.school.findMany({
    where: { acaraId: { not: null } },
    select: { name: true, acaraId: true },
  });
  return schools
    .filter((s): s is typeof s & { acaraId: string } => s.acaraId !== null)
    .map((s) => makeSchoolSlug(s.name, s.acaraId));
}

export interface SchoolResult {
  id: string;
  name: string;
  type: string;
  sector: string;
  acaraId: string | null;
  yearRange: string | null;
  gender: string | null;
  icsea: number | null;
  enrolment: number | null;
  suburb: {
    name: string;
    state: string;
    postcode: string;
    slug: string;
  };
}

export async function searchSchools(params: {
  q?: string;
  type?: string;
  sector?: string;
  state?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ schools: SchoolResult[]; total: number }> {
  const { q, type, sector, state, page = 1, pageSize = 20 } = params;

  const where = {
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    ...(type ? { type } : {}),
    ...(sector ? { sector } : {}),
    ...(state ? { suburb: { state } } : {}),
  };

  const [schools, total] = await Promise.all([
    db.school.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        sector: true,
        acaraId: true,
        yearRange: true,
        gender: true,
        icsea: true,
        enrolment: true,
        suburb: {
          select: { name: true, state: true, postcode: true, slug: true },
        },
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.school.count({ where }),
  ]);

  return { schools, total };
}

// ---------------------------------------------------------------------------
// Schools by suburb id (for nearby-school comparisons on school detail page)
// ---------------------------------------------------------------------------
export interface NearbySchoolResult {
  name: string;
  acaraId: string | null;
  icsea: number | null;
  type: string;
  sector: string;
}

export async function getSchoolsInSuburb(suburbId: string, excludeAcaraId?: string): Promise<NearbySchoolResult[]> {
  return db.school.findMany({
    where: {
      suburbId,
      ...(excludeAcaraId ? { NOT: { acaraId: excludeAcaraId } } : {}),
    },
    select: { name: true, acaraId: true, icsea: true, type: true, sector: true },
    orderBy: { icsea: "desc" },
    take: 5,
  });
}

// ---------------------------------------------------------------------------
// Schools by region (via suburb slugs)
// ---------------------------------------------------------------------------
export interface RegionSchoolResult {
  id: string;
  name: string;
  acaraId: string | null;
  type: string;
  sector: string;
  yearRange: string | null;
  gender: string | null;
  icsea: number | null;
  enrolment: number | null;
  suburb: {
    name: string;
    slug: string;
    state: string;
    medianHousePrice: number;
  };
}

export async function getSchoolsByRegion(suburbSlugs: string[]): Promise<RegionSchoolResult[]> {
  if (suburbSlugs.length === 0) return [];

  // Resolve suburb IDs from slugs
  const suburbs = await db.suburb.findMany({
    where: { slug: { in: suburbSlugs } },
    select: { id: true, slug: true, name: true, state: true, medianHousePrice: true },
  });

  const suburbIds = suburbs.map((s) => s.id);
  if (suburbIds.length === 0) return [];

  const suburbMap = new Map(suburbs.map((s) => [s.id, s]));

  const schools = await db.school.findMany({
    where: { suburbId: { in: suburbIds } },
    select: {
      id: true,
      name: true,
      acaraId: true,
      type: true,
      sector: true,
      yearRange: true,
      gender: true,
      icsea: true,
      enrolment: true,
      suburbId: true,
    },
    orderBy: { icsea: "desc" },
  });

  return schools.map((sc) => {
    const sub = suburbMap.get(sc.suburbId);
    return {
      id: sc.id,
      name: sc.name,
      acaraId: sc.acaraId,
      type: sc.type,
      sector: sc.sector,
      yearRange: sc.yearRange,
      gender: sc.gender,
      icsea: sc.icsea,
      enrolment: sc.enrolment,
      suburb: {
        name: sub?.name ?? "",
        slug: sub?.slug ?? "",
        state: sub?.state ?? "",
        medianHousePrice: sub?.medianHousePrice ?? 0,
      },
    };
  });
}
