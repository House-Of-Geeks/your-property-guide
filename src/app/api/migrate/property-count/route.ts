import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// One-shot diag: count PropertyAddress rows + group by state for the
// property sitemap index. Delete after debug.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const total = await db.propertyAddress.count();
    const withSlug = await db.propertyAddress.count({ where: { suburbSlug: { not: null } } });
    const byState = await db.$queryRaw<{ state: string; cnt: bigint }[]>`
      SELECT state, COUNT(*) AS cnt
      FROM "PropertyAddress"
      WHERE "suburbSlug" IS NOT NULL
      GROUP BY state
    `;
    return NextResponse.json({
      ok: true,
      totalRows: total,
      withSuburbSlug: withSlug,
      byState: byState.map((r) => ({ state: r.state, count: Number(r.cnt) })),
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }, { status: 500 });
  }
}
