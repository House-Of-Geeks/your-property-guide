import { after } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { attributionJson, type LeadAttribution } from "@/lib/attribution-server";
import {
  sent247Config,
  sent247HoldReason,
  sendSent247Partial,
  type RequestContext,
} from "@/lib/sent247";

// Guide-funnel partials: name + email given, mobile not yet. The Why Solar
// model (its app/api/partial-lead): one PartialLead row per email per guide,
// upserted on every save, deleted when that email completes a lead. Saved
// from the funnel's email step (/api/partial-lead) and, for a tab loaded
// before Oct 2026's two-step funnels, from a phone-less guide download
// posted to /api/leads.

export const PARTIAL_SOURCES = ["selling-guide", "buying-guide"] as const;
export type PartialSource = (typeof PARTIAL_SOURCES)[number];

/** The funnel's answers so far, named as the lead payload names them. */
export const partialAnswersSchema = z.object({
  guideType: z.enum(["selling", "buying"]).optional(),
  suburb: z.string().max(120).optional(),
  propertyType: z.string().max(40).optional(),
  bedrooms: z.string().max(10).optional(),
  sellingTimeframe: z.enum(["0-3-months", "3-6-months", "6-12-months", "12-plus-months", "researching"]).optional(),
  agentStatus: z.enum(["comparing", "not-started", "already-listed"]).optional(),
  motivation: z.string().max(60).optional(),
  priceExpectation: z.string().max(40).optional(),
  buyerPersona: z.enum(["first-home", "upgrading", "investing", "downsizing"]).optional(),
  financeStatus: z.enum(["pre-approved", "talking-to-lenders", "not-started", "cash"]).optional(),
  budget: z.string().max(40).optional(),
});
export type PartialAnswers = z.infer<typeof partialAnswersSchema>;

export interface PartialInput {
  email: string;
  firstName?: string;
  lastName?: string;
  source: PartialSource;
  answers: PartialAnswers;
  /** Where the funnel sat (the lead payload's `source`, e.g. "homepage-guide"). */
  placement?: string;
}

export function partialEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function savePartialGuideLead(
  input: PartialInput,
  attribution: LeadAttribution,
  ctx: RequestContext,
): Promise<{ id: string }> {
  const email = partialEmail(input.email);
  const firstName = input.firstName?.trim() || undefined;
  const lastName = input.lastName?.trim() || undefined;
  const data = {
    answers: input.answers,
    ...(input.placement ? { placement: input.placement } : {}),
  } as Prisma.InputJsonObject;
  const attr = attributionJson(attribution);

  const row = await db.partialLead.upsert({
    where: { email_source: { email, source: input.source } },
    // A later save only adds: it never blanks a name or a click id.
    update: {
      firstName,
      lastName,
      data,
      pageUrl: attribution.sourcePage ?? undefined,
      gclid: attribution.gclid ?? undefined,
      attribution: attr,
    },
    create: {
      email,
      firstName,
      lastName,
      source: input.source,
      data,
      pageUrl: attribution.sourcePage ?? undefined,
      gclid: attribution.gclid ?? undefined,
      attribution: attr,
    },
    select: { id: true },
  });

  // Vendor partials YPG may sell are also held in Sent 24/7, whose recovery
  // sequence emails a resume link. After the response, so Sent 24/7 never
  // slows or fails the funnel.
  const cfg = sent247Config();
  const answers = { type: "guide-download", ...input.answers, source: input.placement };
  if (cfg && !sent247HoldReason(answers)) {
    after(() =>
      sendSent247Partial(cfg.apiKey, {
        partialId: row.id,
        email,
        firstName,
        lastName,
        answers,
        campaignId: cfg.vendorCampaignId,
        attribution,
        ctx,
      }),
    );
  }
  return { id: row.id };
}

/** A completed lead supersedes every partial for its email (Why Solar deletes them too). */
export async function deletePartialsFor(email: string): Promise<void> {
  await db.partialLead.deleteMany({ where: { email: partialEmail(email) } });
}

/** What the funnel needs to restore itself from a partial. */
export function shapePartial(row: {
  email: string;
  firstName: string | null;
  lastName: string | null;
  source: string;
  data: unknown;
}) {
  const data = (row.data ?? {}) as { answers?: unknown };
  const parsed = partialAnswersSchema.safeParse(data.answers ?? {});
  return {
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    source: row.source,
    answers: parsed.success ? parsed.data : {},
  };
}
