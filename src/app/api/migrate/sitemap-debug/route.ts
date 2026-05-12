import { NextResponse } from "next/server";
import { getAllSuburbSlugsWithDates } from "@/lib/services/suburb-service";

// One-shot diagnostic: invoke the same helper the suburbs sitemap uses
// and report what comes back. If this returns thousands, the sitemap
// function works fine in isolation and the issue is in how Next.js is
// caching/serving the sitemap. If it returns zero or errors, the DB or
// helper is the problem.
export async function GET() {
  try {
    const rows = await getAllSuburbSlugsWithDates();
    return NextResponse.json({
      ok: true,
      count: rows.length,
      sample: rows.slice(0, 3),
      buildPhase: process.env.NEXT_PHASE ?? null,
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      buildPhase: process.env.NEXT_PHASE ?? null,
    }, { status: 500 });
  }
}
