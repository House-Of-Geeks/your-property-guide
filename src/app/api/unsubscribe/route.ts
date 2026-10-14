import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/unsubscribe?t=<token>: stop the optional guidance series (and
// record it). POST is the one-click form mail clients use. Always lands on
// /unsubscribed, whether or not the token matched, so it can't be used to
// test which tokens exist.

async function unsubscribe(token: string | null): Promise<void> {
  if (!token || token.length < 10) return;
  const lead = await db.lead.findUnique({ where: { token }, select: { id: true, unsubscribedAt: true } });
  if (!lead || lead.unsubscribedAt) return;
  await db.lead.update({ where: { id: lead.id }, data: { unsubscribedAt: new Date(), sequenceNextAt: null, marketingConsent: false } });
  await db.leadEvent.create({ data: { leadId: lead.id, type: "unsubscribed", actor: "customer" } });
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
