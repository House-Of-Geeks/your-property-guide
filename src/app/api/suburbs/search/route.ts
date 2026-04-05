import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const isPostcode = /^\d+$/.test(q);

  const results = await db.suburb.findMany({
    where: isPostcode
      ? { postcode: { startsWith: q } }
      : {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { postcode: { startsWith: q } },
          ],
        },
    select: { slug: true, name: true, state: true, postcode: true },
    orderBy: { name: "asc" },
    take: 8,
  });

  return NextResponse.json(results);
}
