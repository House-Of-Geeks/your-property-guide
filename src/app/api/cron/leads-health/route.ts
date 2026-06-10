import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL } from "@/lib/email";
import { EMAIL_COLORS, emailLayout } from "@/lib/email-theme";

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
  const C = EMAIL_COLORS;
  return emailLayout({
    variant: "alert",
    eyebrow: `No leads in the last ${windowHours}h`,
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0 0 12px;">The daily lead-health check ran and found <strong>zero leads</strong> in the database for the last ${windowHours} hours.</p>
      <p style="margin:0 0 12px;">This may be normal on a quiet day, or it may indicate a broken form, a rotated SendGrid key, or a deploy regression. Worth a quick sanity check.</p>
      <p style="margin:0;font-size:13px;color:${C.inkSubtle};">Things to verify:</p>
      <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:${C.inkMuted};">
        <li>Submit a test enquiry on yourpropertyguide.com.au</li>
        <li>Check Vercel logs for /api/leads errors</li>
        <li>Confirm SENDGRID_API_KEY is still valid in Vercel env</li>
      </ul>
    </div>`,
  });
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
