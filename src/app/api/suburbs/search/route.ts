import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NON_LOCALITY_SLUGS } from "@/lib/non-localities";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const isPostcode = /^\d+$/.test(q);

  const results = await db.suburb.findMany({
    // Not the postal delivery names ("Nerang BC"): this list feeds the suburb
    // picker on the lead forms.
    where: {
      slug: { notIn: NON_LOCALITY_SLUGS },
      ...(isPostcode
        ? { postcode: { startsWith: q } }
        : {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { postcode: { startsWith: q } },
            ],
          }),
    },
    select: { slug: true, name: true, state: true, postcode: true },
    orderBy: { name: "asc" },
    take: 8,
  });

  return NextResponse.json(results);
}
