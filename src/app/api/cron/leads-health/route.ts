import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL } from "@/lib/email";

// GET /api/cron/leads-health
// Triggered by Vercel Cron (see vercel.json). Counts lead submissions in
// the last 24h; if zero, sends an alert so a silent outage (rotated
// SendGrid key, broken form, hydration bug, etc.) doesn't sit unnoticed.
//
// Auth: Vercel attaches `Authorization: Bearer <CRON_SECRET>` to the
// request. We accept either CRON_SECRET or, as a fallback for manual
// triggering, the existing INDEXNOW_KEY.

export const dynamic = "force-dynamic";

function buildZeroFloorHtml(windowHours: number): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#fff5f5;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #fecaca;border-radius:8px;overflow:hidden;">
    <div style="background:#7f1d1d;padding:16px 20px;">
      <p style="margin:0;color:#fff;font-size:13px;font-weight:600;">No leads in the last ${windowHours}h</p>
    </div>
    <div style="padding:18px 20px;font-size:14px;color:#111827;line-height:1.55;">
      <p style="margin:0 0 12px;">The daily lead-health check ran and found <strong>zero leads</strong> in the database for the last ${windowHours} hours.</p>
      <p style="margin:0 0 12px;">This may be normal on a quiet day, or it may indicate a broken form, a rotated SendGrid key, or a deploy regression. Worth a quick sanity check.</p>
      <p style="margin:0;font-size:13px;color:#6b7280;">Things to verify:</p>
      <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:#374151;">
        <li>Submit a test enquiry on yourpropertyguide.com.au</li>
        <li>Check Vercel logs for /api/leads errors</li>
        <li>Confirm SENDGRID_API_KEY is still valid in Vercel env</li>
      </ul>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const fallbackKey = process.env.INDEXNOW_KEY;

  const isCronTriggered =
    (cronSecret && auth === `Bearer ${cronSecret}`) ||
    (fallbackKey && auth === `Bearer ${fallbackKey}`);

  if (!isCronTriggered) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const WINDOW_HOURS = 24;
  const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000);

  let count: number;
  try {
    count = await db.lead.count({ where: { createdAt: { gte: since } } });
  } catch (err) {
    console.error("leads-health cron: DB query failed", err);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  }

  if (count === 0) {
    try {
      await sendMail({
        to: ANDY_EMAIL,
        subject: `ALERT: No leads in last ${WINDOW_HOURS}h`,
        html: buildZeroFloorHtml(WINDOW_HOURS),
      });
    } catch (mailErr) {
      console.error("leads-health cron: alert email failed", mailErr);
      return NextResponse.json(
        { ok: false, count, alertSent: false, error: "alert email failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, count, alertSent: true, windowHours: WINDOW_HOURS });
  }

  return NextResponse.json({ ok: true, count, alertSent: false, windowHours: WINDOW_HOURS });
}
