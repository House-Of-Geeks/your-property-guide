import { NextResponse, after } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL, LEADS_CC_EMAIL } from "@/lib/email";
import { buildPhoneAddedHtml } from "@/lib/lead-emails";
import { normalizePhone } from "@/lib/utils/phone";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";

// Post-submit phone enrichment. The email-first funnels (guide downloads,
// property enquiries, off-market alerts) deliberately don't require a
// phone before converting; this endpoint lets the thank-you step add one
// afterwards. The lead id is a cuid the client only has because it made
// the original submission, so it acts as the bearer token.
//
// Guard rails: phone can only be set where it's currently empty (no
// overwriting a number the person actually typed), and only on recent
// leads — an id harvested from an old email thread shouldn't still work.
const ENRICH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const enrichSchema = z.object({
  id: z.string().min(10),
  phone: z.string().min(1).max(40),
});

export async function POST(request: Request) {
  const ipKey = ipKeyFromRequest(request);
  const limit = checkRateLimit(`leads-enrich:${ipKey}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  try {
    const body = await request.json();
    const result = enrichSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const phone = normalizePhone(result.data.phone);
    if (!phone) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const lead = await db.lead.findUnique({ where: { id: result.data.id } });
    if (!lead || Date.now() - lead.createdAt.getTime() > ENRICH_WINDOW_MS) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Already has a number (double-submit, back button) — succeed without
    // touching it so the flow stays idempotent.
    if (lead.phone && lead.phone.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // Guarded write: the phone-is-empty condition lives IN the query so a
    // concurrent double-submit can't both pass the check above and both
    // write (the loser matches zero rows and falls into the idempotent
    // path). `count === 0` here means someone else just set it.
    const updated = await db.lead.updateMany({
      where: { id: lead.id, phone: null },
      data: { phone },
    });
    if (updated.count === 0) {
      return NextResponse.json({ success: true });
    }

    // Notify after the response is sent — the DB update above is the
    // canonical record and the user shouldn't wait out an SMTP round-trip
    // for a best-effort email. Same routing rule as new leads:
    // match-request goes to Andy only.
    const notify = async () => {
      try {
        await sendMail({
          to: ANDY_EMAIL,
          cc: lead.type === "match-request" ? undefined : LEADS_CC_EMAIL,
          subject: `Phone added: ${lead.firstName}${lead.lastName ? ` ${lead.lastName}` : ""}${lead.suburb ? ` (${lead.suburb})` : ""}`,
          html: buildPhoneAddedHtml(lead, phone),
        });
      } catch (mailErr) {
        console.error("Phone-added notification failed (phone saved to DB):", {
          leadId: lead.id,
          error: mailErr instanceof Error ? mailErr.message : String(mailErr),
        });
      }
    };
    try {
      after(notify);
    } catch {
      // No request scope (unit tests) — fire and forget instead.
      void notify();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead enrich error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
