import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { fetchSent247PartialByToken } from "@/lib/sent247";
import { PARTIAL_SOURCES, partialEmail, shapePartial, type PartialSource } from "@/lib/partial-leads";

// GET /api/partial-lead/restore: a saved partial's answers, so a guide funnel
// opened from Sent 24/7's recovery email can skip straight to the mobile
// step (Why Solar's app/api/partial-lead/restore).
//
//   ?id=<PartialLead id>               the link's ws_resume. The unguessable
//                                      cuid is the credential.
//   ?token=<resume token>&source=...   any recovery link. The email comes from
//                                      Sent 24/7 (the token's authority), never
//                                      from the request, and our partial is
//                                      matched by that email + source. With no
//                                      partial of ours, Sent 24/7's name and
//                                      email still come back for the prefill.
//
// 410 when Sent 24/7 says the partial was already completed.

const SELECT = { email: true, firstName: true, lastName: true, source: true, data: true } as const;

export async function GET(request: NextRequest) {
  const limit = checkRateLimit(`partial-restore:${ipKeyFromRequest(request)}`, { limit: 20, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const sp = request.nextUrl.searchParams;
  const id = sp.get("id");
  const token = sp.get("token");
  const sourceParam = sp.get("source");
  const source: PartialSource = (PARTIAL_SOURCES as readonly string[]).includes(sourceParam ?? "")
    ? (sourceParam as PartialSource)
    : "selling-guide";

  try {
    if (id) {
      const row = await db.partialLead.findUnique({ where: { id }, select: SELECT });
      return row
        ? NextResponse.json(shapePartial(row))
        : NextResponse.json({ error: "not found" }, { status: 404 });
    }
    if (token) {
      const held = await fetchSent247PartialByToken(token);
      if (!held.ok) {
        return held.completed
          ? NextResponse.json({ error: "already_completed" }, { status: 410 })
          : NextResponse.json({ error: "not found" }, { status: 404 });
      }
      const row =
        (held.wsResume && (await db.partialLead.findUnique({ where: { id: held.wsResume }, select: SELECT }))) ||
        (held.email &&
          (await db.partialLead.findUnique({
            where: { email_source: { email: partialEmail(held.email), source } },
            select: SELECT,
          })));
      if (row) return NextResponse.json(shapePartial(row));
      return NextResponse.json({
        email: held.email,
        firstName: held.firstName,
        lastName: held.lastName,
        source,
        answers: {},
      });
    }
    return NextResponse.json({ error: "id or token required" }, { status: 400 });
  } catch (err) {
    console.error("Partial restore failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
