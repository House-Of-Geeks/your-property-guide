import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { INTRO_STATUSES, type IntroStatus } from "@/lib/introductions/rules";

// POST /api/feedback: the person tells us how an introduction went (the
// link in their confirmation and check-in emails). Stored as a LeadEvent;
// a booked appraisal or consultation moves the status forward, never back.

const schema = z.object({
  token: z.string().trim().min(10).max(80),
  contacted: z.enum(["yes", "no", "not-yet"]),
  useful: z.enum(["yes", "somewhat", "no", "too-early"]),
  booked: z.enum(["yes", "no"]),
  signed: z.enum(["yes", "no", "undecided"]).optional(),
  comment: z.string().trim().max(1000).optional(),
});

const ORDER = (s: string | null) => INTRO_STATUSES.indexOf((s ?? "received") as IntroStatus);

export async function POST(request: Request) {
  const limit = checkRateLimit(`feedback:${ipKeyFromRequest(request)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  const f = parsed.data;
  try {
    const lead = await db.lead.findUnique({ where: { token: f.token }, select: { id: true, kind: true, status: true } });
    if (!lead || lead.kind !== "introduction") return NextResponse.json({ error: "We couldn’t find that request" }, { status: 404 });
    await db.leadEvent.create({
      data: { leadId: lead.id, type: "feedback", actor: "customer", detail: { contacted: f.contacted, useful: f.useful, booked: f.booked, signed: f.signed ?? null, comment: f.comment ?? null } },
    });
    const next: IntroStatus | null = f.signed === "yes" ? "signed" : f.booked === "yes" ? "appointment" : f.contacted === "yes" ? "accepted" : null;
    if (next && ORDER(next) > ORDER(lead.status) && lead.status !== "not-introduced") {
      await db.lead.update({ where: { id: lead.id }, data: { status: next, statusReason: "reported by the customer", statusAt: new Date() } });
      await db.leadEvent.create({ data: { leadId: lead.id, type: "status-changed", actor: "customer", detail: { from: lead.status, to: next } } });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json({ error: "Something went wrong on our side. Please try again." }, { status: 500 });
  }
}
