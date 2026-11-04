import { type NextRequest, NextResponse } from "next/server";
import { processQueue } from "@/lib/mail/queue";

// GET /api/cron/email (Vercel Cron, every 5 minutes; vercel.json). Sends
// every queued email that's due: retries after a temporary failure,
// series steps and newsletter batches. Rows are claimed with FOR UPDATE
// SKIP LOCKED, so an overlapping run can't send the same email. Auth as the
// other crons: Bearer CRON_SECRET, or INDEXNOW_KEY for a manual run.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorised(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  const keys = [process.env.CRON_SECRET, process.env.INDEXNOW_KEY].filter(Boolean);
  return keys.some((k) => auth === `Bearer ${k}`);
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const run = await processQueue({ limit: 40 });
    return NextResponse.json({ ok: true, ...run });
  } catch (err) {
    console.error("Email cron failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
