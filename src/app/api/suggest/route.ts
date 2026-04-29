import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { makeSchoolSlug } from "@/lib/utils/school";
import type { SuggestLocation, SuggestSchool, SuggestAgency, SuggestProperty, SuggestResponse } from "@/types/suggest";

export type { SuggestLocation, SuggestSchool, SuggestAgency, SuggestResponse };

export async function GET(req: NextRequest) {
  const q    = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "default"; // "default" | "agents"

  if (q.length < 2) {
    return NextResponse.json<SuggestResponse>({ locations: [], schools: [], agencies: [], properties: [] });
  }

  const isNumeric = /^\d+$/.test(q);

  // Locations — always included
  const locationsPromise = db.suburb.findMany({
    where: isNumeric
      ? { postcode: { startsWith: q } }
      : {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { postcode: { startsWith: q } },
          ],
        },
    select: { slug: true, name: true, state: true, postcode: true },
    orderBy: { name: "asc" },
    take: 6,
  });

  if (type === "agents") {
    // Agents page: locations + agencies
    const [locations, rawAgencies] = await Promise.all([
      locationsPromise,
      isNumeric
        ? Promise.resolve([] as { slug: string; name: string; addressSuburb: string; addressState: string }[])
        : db.agency.findMany({
            where: { name: { contains: q, mode: "insensitive" } },
            select: { slug: true, name: true, addressSuburb: true, addressState: true },
            orderBy: { name: "asc" },
            take: 4,
          }),
    ]);

    const agencies: SuggestAgency[] = rawAgencies.map((a) => ({
      slug:   a.slug,
      name:   a.name,
      suburb: a.addressSuburb,
      state:  a.addressState,
    }));

    return NextResponse.json<SuggestResponse>({ locations, schools: [], agencies, properties: [] });
  }

  // Default: locations + schools + property addresses
  // Raw query so we can normalize apostrophes on both sides (e.g. "st lukes" matches "St Luke's")
  type RawSchool = { name: string; acaraId: string | null; suburbSlug: string | null; suburbState: string | null; suburbPostcode: string | null; suburbName: string | null };
  const schoolsPromise: Promise<RawSchool[]> = isNumeric
    ? Promise.resolve([])
    : db.$queryRaw`
        SELECT s.name, s."acaraId",
               sub.slug AS "suburbSlug", sub.state AS "suburbState",
               sub.postcode AS "suburbPostcode", sub.name AS "suburbName"
        FROM "School" s
        LEFT JOIN "Suburb" sub ON sub.id = s."suburbId"
        WHERE regexp_replace(lower(s.name), $$[']$$, '', 'g')
              LIKE '%' || regexp_replace(lower(${q}), $$[']$$, '', 'g') || '%'
        ORDER BY CASE WHEN sub.state = 'QLD' THEN 0 ELSE 1 END, s.name
        LIMIT 10
      `;

  // Property address search — only when query starts with a digit (street number)
  const looksLikeAddress = /^\d/.test(q) && q.length >= 3;
  const propertiesPromise = looksLikeAddress
    ? db.propertyAddress.findMany({
        where: { addressFull: { contains: q, mode: "insensitive" } },
        select: { slug: true, addressFull: true, locality: true, state: true, postcode: true },
        take: 5,
      })
    : Promise.resolve([] as { slug: string; addressFull: string; locality: string | null; state: string; postcode: string }[]);

  const [locations, rawSchools, rawProperties] = await Promise.all([locationsPromise, schoolsPromise, propertiesPromise]);

  const schools: SuggestSchool[] = rawSchools.map((s) => ({
    slug:       makeSchoolSlug(s.name, s.acaraId ?? ""),
    name:       s.name,
    state:      s.suburbState ?? "",
    postcode:   s.suburbPostcode ?? "",
    suburbName: s.suburbName ?? "",
    suburbSlug: s.suburbSlug ?? "",
  }));

  const properties: SuggestProperty[] = rawProperties.map((p) => ({
    slug:        p.slug,
    addressFull: p.addressFull.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    locality:    (p.locality ?? "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    state:       p.state,
    postcode:    p.postcode,
  }));

  return NextResponse.json<SuggestResponse>({ locations, schools, agencies: [], properties });
}
