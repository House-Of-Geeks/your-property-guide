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

// Row types stored in the Lead table that are NOT sales enquiries and must
// be excluded from lead-health counts. Newsletter signups reuse the Lead
// table (see components/newsletter/actions.ts) to avoid a schema migration;
// counting them here would mask a real drop in enquiries — a week of pure
// newsletter/spam signups would read as healthy lead flow. Add any future
// synthetic Lead-table types to this list.
const NON_LEAD_TYPES = ["newsletter"];

// A footnote for the daily emails: newsletter signups aren't leads, but
// hiding them entirely would be confusing on a day the "system" shows
// table activity. Surface them as a clearly-labelled aside instead.
function newsletterNote(newsletterCount: number, windowHours: number): string {
  if (newsletterCount <= 0) return "";
  const C = EMAIL_COLORS;
  return `<p style="margin:12px 0 0;font-size:13px;color:${C.inkSubtle};">Aside: ${newsletterCount} newsletter signup${newsletterCount === 1 ? "" : "s"} also came in during this ${windowHours}h window. These aren't sales enquiries and don't count toward lead health.</p>`;
}

function buildZeroFloorHtml(windowHours: number, newsletterCount: number): string {
  const C = EMAIL_COLORS;
  return emailLayout({
    variant: "alert",
    eyebrow: `No leads in the last ${windowHours}h`,
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0 0 12px;">The daily lead-health check ran and found <strong>zero sales enquiries</strong> in the database for the last ${windowHours} hours.</p>
      <p style="margin:0 0 12px;">This may be normal on a quiet day, or it may indicate a broken form, a rotated SendGrid key, or a deploy regression. Worth a quick sanity check.</p>
      <p style="margin:0;font-size:13px;color:${C.inkSubtle};">Things to verify:</p>
      <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:${C.inkMuted};">
        <li>Submit a test enquiry on yourpropertyguide.com.au</li>
        <li>Check Vercel logs for /api/leads errors</li>
        <li>Confirm SENDGRID_API_KEY is still valid in Vercel env</li>
      </ul>
      ${newsletterNote(newsletterCount, windowHours)}
    </div>`,
  });
}

// Sent when leads DID come in. A daily heartbeat so that silence is
// meaningful: if no email arrives at all, the cron itself didn't run.
function buildHeartbeatHtml(count: number, windowHours: number, newsletterCount: number): string {
  const C = EMAIL_COLORS;
  return emailLayout({
    variant: "brand",
    eyebrow: `${count} lead${count === 1 ? "" : "s"} in the last ${windowHours}h`,
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0;">Daily lead-health check ran OK — <strong>${count}</strong> sales enquir${count === 1 ? "y" : "ies"} captured in the last ${windowHours} hours.</p>
      <p style="margin:12px 0 0;font-size:13px;color:${C.inkSubtle};">You get this every day so a silent failure is obvious: no email at all means the check didn't run.</p>
      ${newsletterNote(newsletterCount, windowHours)}
    </div>`,
  });
}

// Sent when the check itself could not run (DB unreachable). This is the
// case that used to fail SILENTLY — a failed check almost always means lead
// capture is failing too, so it must be loud.
function buildFailureHtml(windowHours: number, detail: string): string {
  const C = EMAIL_COLORS;
  return emailLayout({
    variant: "alert",
    eyebrow: `Lead-health check FAILED`,
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0 0 12px;">The daily lead-health check <strong>could not read the database</strong> (after retries) for the last ${windowHours} hours. This usually means the production database is down or unreachable — in which case <strong>lead capture is also failing and enquiries are being lost.</strong></p>
      <p style="margin:0 0 12px;font-size:13px;color:${C.inkMuted};">Error: ${detail}</p>
      <p style="margin:0;font-size:13px;color:${C.inkSubtle};">Things to check:</p>
      <ul style="margin:6px 0 0;padding-left:18px;font-size:13px;color:${C.inkMuted};">
        <li>Railway: is the Postgres-PostGIS service running?</li>
        <li>Vercel logs for /api/leads and /api/cron/leads-health</li>
        <li>Submit a test enquiry on yourpropertyguide.com.au</li>
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

  // Count leads, retrying transient DB blips so we don't fire a false
  // "DB down" alert. (db.ts also retries at the connection layer.)
  // `count` is real sales enquiries only; newsletter signups are counted
  // separately for visibility but never drive the zero/heartbeat decision.
  let count: number | null = null;
  let newsletterCount = 0;
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      [count, newsletterCount] = await Promise.all([
        db.lead.count({ where: { createdAt: { gte: since }, type: { notIn: NON_LEAD_TYPES } } }),
        db.lead.count({ where: { createdAt: { gte: since }, type: "newsletter" } }),
      ]);
      break;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  // The check itself could not run. This used to return 500 silently — the
  // exact failure mode that hid a 24h prod-DB outage. Alert loudly instead:
  // a failed check almost always means lead capture is failing too.
  if (count === null) {
    const detail = lastErr instanceof Error ? lastErr.message : String(lastErr);
    console.error("leads-health cron: DB query failed after retries", lastErr);
    let alertSent = false;
    try {
      await sendMail({
        to: ANDY_EMAIL,
        subject: `🚨 ALERT: Lead-health check FAILED (DB unreachable)`,
        html: buildFailureHtml(WINDOW_HOURS, detail),
      });
      alertSent = true;
    } catch (mailErr) {
      console.error("leads-health cron: failure alert email ALSO failed", mailErr);
    }
    return NextResponse.json(
      { ok: false, error: "DB query failed", alertSent },
      { status: 500 },
    );
  }

  // Always send a daily email so silence is meaningful: zero leads -> alert,
  // some leads -> heartbeat. No email at all == the cron didn't run.
  const isZero = count === 0;
  try {
    await sendMail({
      to: ANDY_EMAIL,
      subject: isZero
        ? `ALERT: No leads in last ${WINDOW_HOURS}h`
        : `Lead health: ${count} lead${count === 1 ? "" : "s"} in last ${WINDOW_HOURS}h`,
      html: isZero
        ? buildZeroFloorHtml(WINDOW_HOURS, newsletterCount)
        : buildHeartbeatHtml(count, WINDOW_HOURS, newsletterCount),
    });
  } catch (mailErr) {
    console.error("leads-health cron: daily email failed", mailErr);
    return NextResponse.json(
      { ok: false, count, newsletterCount, alertSent: false, error: "email failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, count, newsletterCount, alertSent: true, windowHours: WINDOW_HOURS });
}
