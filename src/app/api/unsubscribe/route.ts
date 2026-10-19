import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/unsubscribe?t=<token>: stop the optional guidance series and any
// other marketing email (and record it). Since 20 Oct 2026 it covers every
// row with the same email address, not just the one whose link was used, so
// a newsletter signup and a guide download can't keep one alive. POST is the one-click form mail clients use. Always lands on
// /unsubscribed, whether or not the token matched, so it can't be used to
// test which tokens exist.

async function unsubscribe(token: string | null): Promise<void> {
  if (!token || token.length < 10) return;
  const lead = await db.lead.findUnique({ where: { token }, select: { id: true, email: true, unsubscribedAt: true } });
  if (!lead || lead.unsubscribedAt) return;
  const now = new Date();
  await db.lead.update({ where: { id: lead.id }, data: { unsubscribedAt: now, sequenceNextAt: null, marketingConsent: false } });
  if (lead.email) {
    await db.lead.updateMany({
      where: { email: lead.email, id: { not: lead.id }, unsubscribedAt: null },
      data: { unsubscribedAt: now, sequenceNextAt: null, marketingConsent: false },
    });
  }
  await db.leadEvent.create({ data: { leadId: lead.id, type: "unsubscribed", actor: "customer", detail: { allRowsForEmail: true } } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    await unsubscribe(url.searchParams.get("t"));
  } catch (err) {
    console.error("Unsubscribe failed:", err);
  }
  return NextResponse.redirect(new URL("/unsubscribed", url.origin), 303);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  try {
    await unsubscribe(url.searchParams.get("t"));
  } catch (err) {
    console.error("Unsubscribe failed:", err);
  }
  return NextResponse.json({ ok: true });
}
