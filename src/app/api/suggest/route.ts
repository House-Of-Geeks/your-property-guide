import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { makeSchoolSlug } from "@/lib/utils/school";

export interface SuggestLocation {
  slug: string;
  name: string;
  state: string;
  postcode: string;
}

export interface SuggestSchool {
  slug: string;
  name: string;
  state: string;
  postcode: string;
  suburbName: string;
}

export interface SuggestAgency {
  slug: string;
  name: string;
  suburb: string;
  state: string;
}

export interface SuggestResponse {
  locations: SuggestLocation[];
  schools: SuggestSchool[];
  agencies: SuggestAgency[];
}

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
  const [locations, rawSchools] = await Promise.all([
    locationsPromise,
    isNumeric
      ? Promise.resolve([] as { name: string; acaraId: string; suburb: { state: string; postcode: string; name: string } | null }[])
      : db.school.findMany({
          where: { name: { contains: q, mode: "insensitive" } },
          select: {
            name: true,
            acaraId: true,
            suburb: { select: { state: true, postcode: true, name: true } },
          },
          take: 3,
        }),
  ]);

  const schools: SuggestSchool[] = rawSchools.map((s) => ({
    slug:       makeSchoolSlug(s.name, s.acaraId ?? ""),
    name:       s.name,
    state:      s.suburb?.state ?? "",
    postcode:   s.suburb?.postcode ?? "",
    suburbName: s.suburb?.name ?? "",
  }));

  return NextResponse.json<SuggestResponse>({ locations, schools, agencies: [] });
}
