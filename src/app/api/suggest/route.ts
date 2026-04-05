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

export interface SuggestResponse {
  locations: SuggestLocation[];
  schools: SuggestSchool[];
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json<SuggestResponse>({ locations: [], schools: [] });
  }

  const isNumeric = /^\d+$/.test(q);

  const [locations, rawSchools] = await Promise.all([
    db.suburb.findMany({
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
    }),
    // Skip school search for numeric queries (postcode search)
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
    slug: makeSchoolSlug(s.name, s.acaraId ?? ""),
    name: s.name,
    state: s.suburb?.state ?? "",
    postcode: s.suburb?.postcode ?? "",
    suburbName: s.suburb?.name ?? "",
  }));

  return NextResponse.json<SuggestResponse>({ locations, schools });
}
