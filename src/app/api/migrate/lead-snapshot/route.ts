import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// One-shot read-only diagnostic: how many leads are in prod, what types,
// how recent, and how many were tests vs real submissions. Returns counts
// + the 10 most recent. Delete after the conversion audit is finished.
export async function GET() {
  const total = await db.lead.count();
  const byType = await db.lead.groupBy({
    by: ["type"],
    _count: { _all: true },
    orderBy: { _count: { id: "desc" } },
  });

  const since30d = new Date(Date.now() - 30 * 86_400_000);
  const since7d  = new Date(Date.now() -  7 * 86_400_000);
  const since24h = new Date(Date.now() -      86_400_000);
  const [last30, last7, last24] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: since30d } } }),
    db.lead.count({ where: { createdAt: { gte: since7d  } } }),
    db.lead.count({ where: { createdAt: { gte: since24h } } }),
  ]);

  const recent = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      type: true, firstName: true, lastName: true,
      email: true, source: true, createdAt: true, routedToAgent: true,
    },
  });
  const cleanedRecent = recent.map((l) => ({
    ...l,
    looksLikeTest:
      /^test/i.test(l.firstName ?? "") ||
      /claude/i.test(l.lastName ?? "") ||
      /test|claude/i.test(l.source ?? ""),
    // Mask the email so this endpoint is safe to leave on briefly
    email: l.email ? l.email.replace(/^(.{2}).*(@.+)$/, "$1***$2") : null,
  }));

  return NextResponse.json({
    total,
    last30Days: last30,
    last7Days:  last7,
    last24h:    last24,
    byType,
    recent: cleanedRecent,
  });
}
