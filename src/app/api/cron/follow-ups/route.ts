import { type NextRequest, NextResponse } from "next/server";
import { guidanceSeriesEnabled, introCheckInsEnabled } from "@/lib/flags";
import { queueDueCheckIns, queueDueSeries } from "@/lib/mail/sequences";

// GET /api/cron/follow-ups (Vercel Cron, daily). Decides who is due and
// queues their email; /api/cron/email sends it (21 Oct 2026). Two jobs,
// each switched on separately so nothing customer-facing starts by surprise:
//   GUIDANCE_SEQUENCE_ENABLED=true  queues the next email in the optional
//     guidance series for people who ticked the box, under the cutover
//     policy in src/lib/mail/sequences.ts (no catch-up burst, completed
//     steps kept, never after an unsubscribe or suppression);
//   INTRO_CHECKIN_ENABLED=true  asks people introduced 10 days ago (status
//     sent or accepted) how it went, once, unless they've unsubscribed.
// Auth as leads-health: Bearer CRON_SECRET, or INDEXNOW_KEY for a manual run.

export const dynamic = "force-dynamic";

function authorised(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  const keys = [process.env.CRON_SECRET, process.env.INDEXNOW_KEY].filter(Boolean);
  return keys.some((k) => auth === `Bearer ${k}`);
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = new Date();
  const out: Record<string, unknown> = {};
  try {
    out.sequences = guidanceSeriesEnabled() ? await queueDueSeries(now) : "off";
    out.checkIns = introCheckInsEnabled() ? await queueDueCheckIns(now) : "off";
    return NextResponse.json({ ok: true, ...out });
  } catch (err) {
    console.error("Follow-ups cron failed:", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
