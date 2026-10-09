import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { attributionFromRequest } from "@/lib/attribution-server";
import { requestContext } from "@/lib/sent247";
import { PARTIAL_SOURCES, partialAnswersSchema, savePartialGuideLead } from "@/lib/partial-leads";

// POST /api/partial-lead: the guide funnels' email step. Saves (upserts) the
// visitor as a PartialLead: no team email, no guide yet, never shared with an
// agent. Sellable vendor partials are also held in Sent 24/7 for its recovery
// sequence (lib/partial-leads.ts). The funnel fires this and moves on without
// waiting, as Why Solar's does.

const schema = z.object({
  email: z.string().trim().email().max(200),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  source: z.enum(PARTIAL_SOURCES),
  placement: z.string().max(80).optional(),
  answers: partialAnswersSchema.default({}),
  website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  const limit = checkRateLimit(`partial-lead:${ipKeyFromRequest(request)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    const body = parsed.data;
    // Honeypot: answer like a save, store nothing.
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }
    const { id } = await savePartialGuideLead(
      {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        source: body.source,
        answers: body.answers,
        placement: body.placement,
      },
      attributionFromRequest(request),
      requestContext(request),
    );
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Partial lead save failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
