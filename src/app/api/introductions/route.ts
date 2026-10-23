import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { attributionFromRequest } from "@/lib/attribution-server";
import { requestContext } from "@/lib/sent247";
import { normalizePhone } from "@/lib/utils/phone";
import { checkLeadSpam } from "@/lib/hq-leads";
import { handleIntroductionRequest } from "@/lib/introductions/server";

// POST /api/introductions: the introduction path (Oct 2026). Someone asks to
// be introduced to a selling agent, a buyer's agent, or one of each, and
// ticks a separate permission box for each. Learning requests (guides,
// plans) never come here and never reach an agent. See
// src/lib/introductions/server.ts for what happens to a request.

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
const SERVICES = ["selling-agent", "buyers-agent"] as const;

const schema = z
  .object({
    services: z.array(z.enum(SERVICES)).min(1).max(2),
    consents: z.object({ "selling-agent": z.boolean().optional(), "buyers-agent": z.boolean().optional() }),
    journey: z.enum(["buying", "selling", "buying-and-selling"]),
    firstName: z.string().trim().min(1).max(60),
    lastName: z.string().trim().max(60).optional(),
    email: z.string().trim().email().max(200),
    // Agents need a number to arrange an appraisal or consultation; the
    // preferred method decides how they get in touch first.
    phone: z.string().trim().min(6).max(30),
    preferredContact: z.enum(["phone", "sms", "email"]),
    bestTime: z.enum(["any", "morning", "afternoon", "evening"]).optional(),
    state: z.enum(STATES).optional(),
    suburb: z.string().trim().max(120).optional(),
    propertyType: z.string().trim().max(40).optional(),
    timeframe: z.enum(["0-3-months", "3-6-months", "6-12-months", "12-plus-months", "researching"]).optional(),
    sellerStatus: z.enum(["not-started", "comparing", "already-listed"]).optional(),
    buyerStatus: z.enum(["not-started", "comparing", "already-engaged"]).optional(),
    buyerType: z.string().trim().max(40).optional(),
    budget: z.string().trim().max(40).optional(),
    notes: z.string().trim().max(500).optional(),
    marketingConsent: z.boolean(),
    requestKey: z.string().trim().min(8).max(80),
    source: z.string().trim().max(120).optional(),
    website: z.string().optional(), // honeypot
  })
  .refine((v) => new Set(v.services).size === v.services.length, { message: "Duplicate service", path: ["services"] })
  .refine((v) => normalizePhone(v.phone) !== null, { message: "Enter a phone number we can call", path: ["phone"] });

export async function POST(request: Request) {
  const limit = checkRateLimit(`intro:${ipKeyFromRequest(request)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;

  const spam = checkLeadSpam({
    honeypot: input.website,
    name: [input.firstName, input.lastName].filter(Boolean).join(" "),
    message: input.notes,
  });
  if (spam.spam) {
    // Honeypot or obvious spam: look successful, keep nothing.
    return NextResponse.json({ ok: true, groupId: "ok", duplicate: false, items: [] });
  }
  // An introduction needs a yes for at least one service it asks for.
  if (!input.services.some((s) => input.consents[s] === true)) {
    return NextResponse.json(
      { error: "Tick the permission box so we can introduce you.", details: { fieldErrors: { consents: ["Permission needed"] } } },
      { status: 400 },
    );
  }

  try {
    const result = await handleIntroductionRequest(input, attributionFromRequest(request), requestContext(request));
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("Introduction request error:", err);
    return NextResponse.json({ error: "Something went wrong on our side. Please try again." }, { status: 500 });
  }
}
