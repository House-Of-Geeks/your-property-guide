import { NextRequest, NextResponse } from "next/server";
import { getSuburbBySlug } from "@/lib/services/suburb-service";
import { buildHomeValueSummary } from "@/lib/home-value";

// Suburb figures for the house-worth guide's appraisal form, fetched after
// the visitor picks a suburb. Read-only, one row, cached at the edge for a
// day: the same figures sit on the (7-day ISR) suburb page, so nothing here
// is fresher than that.
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")?.trim() ?? "";
  if (!/^[a-z0-9-]{3,120}$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const suburb = await getSuburbBySlug(slug);
  if (!suburb) return NextResponse.json({ error: "Suburb not found" }, { status: 404 });
  return NextResponse.json(buildHomeValueSummary(suburb), {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
