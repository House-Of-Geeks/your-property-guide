// The introduction path, server side (Oct 2026). One request can ask for one
// or two introductions (a selling agent, a buyer's agent); each becomes its
// own Lead row (kind "introduction") with its own permission, decision,
// delivery outcome and events. Called by /api/introductions.
//
// Order of work:
//   1. Duplicates: the form's requestKey, then the same email asking for the
//      same service in the last 30 minutes, return the first request's
//      outcome instead of making (and delivering) a second.
//   2. Decide (rules.ts), save, deliver where allowed, and record what really
//      happened (LeadEvent). Status "sent" only on the partner's acceptance.
//   3. Email the team (always) and the person (what happens next, from the
//      real status).

import { randomBytes, randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL, LEADS_CC_EMAIL } from "@/lib/email";
import { attributionJson, attributionRowsFor, type LeadAttribution } from "@/lib/attribution-server";
import { normalizePhone } from "@/lib/utils/phone";
import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { Journey } from "@/lib/lead-kinds";
import { SERVICES, type BestTime, type ContactMethod, type IntroService } from "@/lib/service-model";
import {
  addressFromSuburbSlug,
  describeSent247,
  sendSent247Lead,
  sent247BuyerCampaignId,
  sent247Config,
  type RequestContext,
  type Sent247Outcome,
} from "@/lib/sent247";
import { decideIntroduction, outcomeCopy, type IntroStatus, type ProStatus, type Timeframe } from "./rules";
import {
  buildIntroConfirmationHtml,
  buildIntroTeamEmailHtml,
  introConfirmationSubject,
  introTeamSubject,
  type IntroEmailContext,
  type IntroEmailOutcome,
} from "@/lib/journey-emails";
import { TIMEFRAME_LABELS } from "@/lib/lead-emails";

export interface IntroRequestInput {
  services: IntroService[];
  consents: Partial<Record<IntroService, boolean>>;
  journey: Journey;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  preferredContact: ContactMethod;
  bestTime?: BestTime;
  state?: AustralianState;
  suburb?: string;
  propertyType?: string;
  timeframe?: Timeframe;
  sellerStatus?: "not-started" | "comparing" | "already-listed";
  buyerStatus?: "not-started" | "comparing" | "already-engaged";
  buyerType?: string;
  budget?: string;
  notes?: string;
  marketingConsent: boolean;
  requestKey: string;
  source?: string;
}

export interface IntroResultItem {
  leadId: string;
  service: IntroService;
  status: IntroStatus;
  headline: string;
  body: string;
  who: string;
}

export interface IntroResult {
  groupId: string;
  duplicate: boolean;
  items: IntroResultItem[];
}

const DUPLICATE_WINDOW_MS = 30 * 60_000;
const BEST_TIME_LABELS: Record<BestTime, string> = { any: "Any time", morning: "Mornings", afternoon: "Afternoons", evening: "After 5pm" };

/** "bondi-nsw-2026" -> "Bondi, NSW 2026". */
export function suburbLabelFromSlug(slug: string | null | undefined): string | null {
  const a = addressFromSuburbSlug(slug);
  return a ? `${a.city}, ${a.state} ${a.zip}` : null;
}

function itemFrom(row: { id: string; service: string | null; status: string | null; statusReason: string | null; suburb: string | null; preferredContact: string | null }): IntroResultItem {
  const service = (row.service as IntroService) ?? "selling-agent";
  const status = (row.status as IntroStatus) ?? "held";
  const copy = outcomeCopy({
    service,
    status,
    reason: row.statusReason,
    areaLabel: suburbLabelFromSlug(row.suburb),
    contact: (row.preferredContact as ContactMethod) ?? null,
  });
  return { leadId: row.id, service, status, ...copy };
}

const DUP_SELECT = { id: true, service: true, status: true, statusReason: true, suburb: true, preferredContact: true, groupId: true } as const;

async function findDuplicate(input: IntroRequestInput): Promise<IntroResult | null> {
  const keys = input.services.map((s) => `${input.requestKey}:${s}`);
  const byKey = await db.lead.findMany({ where: { requestKey: { in: keys } }, select: DUP_SELECT });
  const recent =
    byKey.length > 0
      ? byKey
      : await db.lead.findMany({
          where: {
            type: "introduction-request",
            email: input.email.trim().toLowerCase(),
            service: { in: input.services },
            createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
          },
          select: DUP_SELECT,
          orderBy: { createdAt: "desc" },
          take: input.services.length,
        });
  if (recent.length === 0) return null;
  await db.leadEvent.createMany({
    data: recent.map((r) => ({ leadId: r.id, type: "duplicate-submit", actor: "system", detail: { requestKey: input.requestKey } })),
  });
  return { groupId: recent[0].groupId ?? recent[0].id, duplicate: true, items: recent.map(itemFrom) };
}

async function deliver(
  service: IntroService,
  input: IntroRequestInput,
  leadId: string,
  consentText: string,
  attribution: LeadAttribution,
  ctx: RequestContext,
): Promise<{ status: IntroStatus; reason: string; delivery: string; outcome: Sent247Outcome | null }> {
  const cfg = sent247Config();
  const campaignId = service === "selling-agent" ? cfg?.vendorCampaignId : sent247BuyerCampaignId();
  if (!cfg || !campaignId) {
    return {
      status: "held",
      reason: "partner delivery not switched on: team to introduce by hand",
      delivery: describeSent247({ kind: "off" }),
      outcome: null,
    };
  }
  const outcome = await sendSent247Lead(cfg.apiKey, {
    lead: {
      type: "introduction-request",
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      suburb: input.suburb,
      source: input.source,
      propertyType: input.propertyType,
      sellingTimeframe: input.timeframe,
      agentStatus: service === "selling-agent" ? input.sellerStatus : undefined,
      guideType: service === "buyers-agent" ? "buying" : "selling",
    },
    campaignId,
    referenceId: leadId,
    consentText,
    attribution,
    ctx,
    extraFields: {
      service,
      preferred_contact: input.preferredContact,
      ...(input.bestTime ? { best_time: BEST_TIME_LABELS[input.bestTime] } : {}),
      ...(input.timeframe ? { timeframe: TIMEFRAME_LABELS[input.timeframe] ?? input.timeframe } : {}),
    },
  });
  if (outcome.kind === "accepted") return { status: "sent", reason: "accepted by the partner channel", delivery: describeSent247(outcome), outcome };
  if (outcome.kind === "rejected") {
    return { status: "held", reason: `partner channel declined it (${outcome.reason}): team to review`, delivery: describeSent247(outcome), outcome };
  }
  return { status: "held", reason: "delivery failed: team to forward by hand", delivery: describeSent247(outcome), outcome };
}

/** Prisma's unique-constraint error: a simultaneous double submit lost the race on requestKey. */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

export async function handleIntroductionRequest(
  input: IntroRequestInput,
  attribution: LeadAttribution,
  ctx: RequestContext,
): Promise<IntroResult> {
  const duplicate = await findDuplicate(input);
  if (duplicate) return duplicate;
  try {
    return await createIntroductions(input, attribution, ctx);
  } catch (err) {
    // Two copies of the same submission arrived together: the first one's
    // rows exist now, so answer with them rather than an error.
    if (isUniqueViolation(err)) {
      const first = await findDuplicate(input);
      if (first) return first;
    }
    throw err;
  }
}

async function createIntroductions(
  input: IntroRequestInput,
  attribution: LeadAttribution,
  ctx: RequestContext,
): Promise<IntroResult> {
  const groupId = randomUUID();
  const phone = normalizePhone(input.phone) ?? input.phone.trim();
  const email = input.email.trim().toLowerCase();
  const results: IntroEmailOutcome[] = [];
  const items: IntroResultItem[] = [];
  const consentTexts: Partial<Record<IntroService, string>> = {};

  for (const service of input.services) {
    const consent = input.consents[service] === true;
    const consentText = SERVICES[service].permission;
    if (consent) consentTexts[service] = consentText;
    const proStatus: ProStatus | undefined = service === "selling-agent" ? input.sellerStatus : input.buyerStatus;
    const decision = decideIntroduction({
      service,
      state: input.state ?? null,
      suburb: input.suburb ?? null,
      timeframe: input.timeframe ?? null,
      proStatus: proStatus ?? null,
      introConsent: consent,
    });

    const row = await db.lead.create({
      data: {
        type: "introduction-request",
        kind: "introduction",
        journey: input.journey,
        service,
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() || undefined,
        email,
        phone,
        suburb: input.suburb,
        state: input.state,
        propertyType: input.propertyType,
        timeframe: input.timeframe,
        stage: proStatus,
        source: input.source,
        message: [
          input.buyerType && `Buyer type: ${input.buyerType}`,
          input.budget && `Budget: ${input.budget}`,
          input.notes && `Note: ${input.notes}`,
        ]
          .filter(Boolean)
          .join(" · ") || undefined,
        introConsent: consent,
        consentText: consent ? consentText : null,
        marketingConsent: input.marketingConsent,
        preferredContact: input.preferredContact,
        bestTime: input.bestTime,
        status: "received",
        statusAt: new Date(),
        requestKey: `${input.requestKey}:${service}`,
        groupId,
        token: randomBytes(18).toString("base64url"),
        gclid: attribution.gclid ?? undefined,
        attribution: attributionJson(attribution),
        events: { create: { type: "submitted", actor: "customer", detail: { service, consent, decision: decision.action } } },
      },
      select: { id: true, token: true },
    });

    let status: IntroStatus;
    let reason: string;
    let delivery: string | null = null;
    if (decision.action === "deliver") {
      const d = await deliver(service, { ...input, phone }, row.id, consentText, attribution, ctx);
      status = d.status;
      reason = d.reason;
      delivery = d.delivery;
      await db.leadEvent.create({
        data: {
          leadId: row.id,
          type: d.status === "sent" ? "delivered" : d.outcome?.kind === "failed" ? "delivery-failed" : "held",
          actor: "system",
          detail: { channel: "sent247", outcome: d.outcome ? JSON.parse(JSON.stringify(d.outcome)) : { kind: "off" }, reason: d.reason },
        },
      });
    } else {
      status = decision.action === "hold" ? "held" : "not-introduced";
      reason = decision.reason;
      await db.leadEvent.create({ data: { leadId: row.id, type: status, actor: "system", detail: { reason } } });
    }
    await db.lead.update({ where: { id: row.id }, data: { status, statusReason: reason, statusAt: new Date() } });

    results.push({ leadId: row.id, service, status, reason, delivery, feedbackToken: row.token });
    const copy = outcomeCopy({ service, status, reason, areaLabel: suburbLabelFromSlug(input.suburb), contact: input.preferredContact });
    items.push({ leadId: row.id, service, status, ...copy });
  }

  const person = {
    firstName: input.firstName.trim(),
    lastName: input.lastName?.trim() || null,
    email,
    phone,
    preferredContact: input.preferredContact,
    bestTime: input.bestTime ? BEST_TIME_LABELS[input.bestTime] : null,
  };
  const emailCtx: IntroEmailContext = {
    journey: input.journey,
    state: input.state ?? null,
    suburbLabel: suburbLabelFromSlug(input.suburb),
    propertyType: input.propertyType ?? null,
    timeframe: input.timeframe ? TIMEFRAME_LABELS[input.timeframe] ?? input.timeframe : null,
    proStatus: [input.sellerStatus && `Selling: ${input.sellerStatus}`, input.buyerStatus && `Buying: ${input.buyerStatus}`].filter(Boolean).join(" · ") || null,
    buyerType: input.buyerType ?? null,
    budget: input.budget ?? null,
    notes: input.notes ?? null,
    marketingConsent: input.marketingConsent,
    consentTexts,
  };

  // The team hears about every request; a failure is logged, never fatal
  // (the rows and events are the record, and the daily health check reads them).
  try {
    await sendMail({
      to: ANDY_EMAIL,
      cc: LEADS_CC_EMAIL,
      subject: introTeamSubject(person, emailCtx, results),
      html: buildIntroTeamEmailHtml(person, emailCtx, results, attributionRowsFor(attribution)),
    });
  } catch (err) {
    console.error("Introduction team email failed (rows saved):", { groupId, error: err instanceof Error ? err.message : String(err) });
  }
  try {
    await sendMail({
      to: email,
      replyTo: ANDY_EMAIL,
      subject: introConfirmationSubject(results),
      html: buildIntroConfirmationHtml(person, emailCtx, results),
    });
  } catch (err) {
    console.error("Introduction confirmation email failed:", { groupId, error: err instanceof Error ? err.message : String(err) });
  }

  return { groupId, duplicate: false, items };
}
