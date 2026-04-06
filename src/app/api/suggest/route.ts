import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { makeSchoolSlug } from "@/lib/utils/school";
import type { SuggestLocation, SuggestSchool, SuggestAgency, SuggestResponse } from "@/types/suggest";

export type { SuggestLocation, SuggestSchool, SuggestAgency, SuggestResponse };

export async function GET(req: NextRequest) {
  const q    = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "default"; // "default" | "agents"

  if (q.length < 2) {
    return NextResponse.json<SuggestResponse>({ locations: [], schools: [], agencies: [] });
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

    return NextResponse.json<SuggestResponse>({ locations, schools: [], agencies });
  }

  // Default: locations + schools
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
        LIMIT 5
      `;

  const [locations, rawSchools] = await Promise.all([locationsPromise, schoolsPromise]);

  const schools: SuggestSchool[] = rawSchools.map((s) => ({
    slug:       makeSchoolSlug(s.name, s.acaraId ?? ""),
    name:       s.name,
    state:      s.suburbState ?? "",
    postcode:   s.suburbPostcode ?? "",
    suburbName: s.suburbName ?? "",
    suburbSlug: s.suburbSlug ?? "",
  }));

  return NextResponse.json<SuggestResponse>({ locations, schools, agencies: [] });
}
