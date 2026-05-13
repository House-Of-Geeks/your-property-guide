// Best Deals service — read-side queries for the public surface plus
// internal helpers shared by the dashboard / admin write paths.
//
// Reads default to status="live" + publishAt <= now() + expiresAt > now().
// Internal callers (dashboard, admin) opt in to other statuses explicitly.

import { db } from "@/lib/db";
import type {
  BestDeal,
  BestDealFilters,
  DealAudience,
  DealPropertyType,
  DealStatus,
} from "@/types/best-deal";

// The shape Prisma returns when we include the agent + agency join. Keeping
// the type narrow protects us from accidentally surfacing partner-only
// fields in public components.
type PrismaBestDealWithAgent = Awaited<ReturnType<typeof db.bestDeal.findFirst>> & {
  partnerAgent?: {
    id: string;
    slug: string;
    fullName: string;
    phone: string;
    email: string;
    image: string;
    agencyId: string;
    agency?: { name: string } | null;
  } | null;
  suburb?: { name: string } | null;
};

function toBestDeal(row: PrismaBestDealWithAgent): BestDeal {
  if (!row) throw new Error("toBestDeal: null row");
  return {
    id:              row.id,
    partnerAgentId:  row.partnerAgentId,
    status:          row.status as DealStatus,
    title:           row.title,
    headline:        row.headline,
    pitch:           row.pitch,
    propertyType:    row.propertyType as DealPropertyType,
    suburbSlug:      row.suburbSlug,
    suburbName:      row.suburb?.name ?? row.suburbSlug,
    state:           row.state,
    postcode:        row.postcode,
    bedrooms:        row.bedrooms,
    bathrooms:       row.bathrooms,
    carSpaces:       row.carSpaces,
    landArea:        row.landArea,
    buildArea:       row.buildArea,
    priceMin:        row.priceMin,
    priceMax:        row.priceMax,
    priceText:       row.priceText,
    heroImage:       row.heroImage,
    gallery:         row.gallery,
    floorplanUrl:    row.floorplanUrl,
    externalListingUrl: row.externalListingUrl,
    dealTypes:       row.dealTypes as DealAudience[],
    tags:            row.tags,
    publishAt:       row.publishAt ? row.publishAt.toISOString() : null,
    expiresAt:       row.expiresAt.toISOString(),
    lastReviewedBy:  row.lastReviewedBy,
    lastReviewedAt:  row.lastReviewedAt ? row.lastReviewedAt.toISOString() : null,
    rejectionReason: row.rejectionReason,
    disclosureText:  row.disclosureText,
    agentCommissionDisclosed: row.agentCommissionDisclosed,
    viewCount:       row.viewCount,
    clickCount:      row.clickCount,
    agent: row.partnerAgent
      ? {
          id:         row.partnerAgent.id,
          slug:       row.partnerAgent.slug,
          fullName:   row.partnerAgent.fullName,
          phone:      row.partnerAgent.phone,
          email:      row.partnerAgent.email,
          image:      row.partnerAgent.image,
          agencyId:   row.partnerAgent.agencyId,
          agencyName: row.partnerAgent.agency?.name,
        }
      : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Predicate for "publicly visible right now". Used by every read query that
// surfaces to anonymous visitors. Status == "live" alone is not enough —
// a deal can be live but scheduled (publishAt in the future) or expired
// before the nightly cron has flipped the status.
const livePublicWhere = () => {
  const now = new Date();
  return {
    status: "live",
    AND: [
      { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
      { expiresAt: { gt: now } },
    ],
  };
};

// Resilience wrap — the BestDeal table is created by a Prisma migration
// that may not have been applied yet to a given environment (the schema
// can land before the DB push). Until the table exists, queries fail with
// Postgres error 42P01 ("relation does not exist"). Treat that as "no
// live deals" rather than a 500 on the homepage / /best-deals routes.
async function safeQuery<T>(label: string, fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const code = (err as { code?: string } | null)?.code;
    const msg = err instanceof Error ? err.message : String(err);
    if (code === "P2021" || /relation .* does not exist|table .* (not found|does not exist)/i.test(msg)) {
      return fallback;
    }
    console.error(`[best-deal-service] ${label} failed:`, msg);
    throw err;
  }
}

export async function getLiveBestDeals(filters: BestDealFilters = {}): Promise<BestDeal[]> {
  const where = {
    ...livePublicWhere(),
    ...(filters.state        ? { state: filters.state.toUpperCase() } : {}),
    ...(filters.suburbSlug   ? { suburbSlug: filters.suburbSlug } : {}),
    ...(filters.propertyType ? { propertyType: filters.propertyType } : {}),
    ...(filters.dealType     ? { dealTypes: { has: filters.dealType } } : {}),
  };

  return safeQuery("getLiveBestDeals", [] as BestDeal[], async () => {
    const rows = await db.bestDeal.findMany({
      where,
      include: {
        partnerAgent: { include: { agency: { select: { name: true } } } },
        suburb: { select: { name: true } },
      },
      orderBy: [
        // Freshest publish first; cards favour newer signal until we have
        // enough click data to rank on engagement.
        { publishAt: "desc" },
        { createdAt: "desc" },
      ],
      take: filters.limit ?? 24,
    });
    return rows.map(toBestDeal);
  });
}

export async function getBestDealById(id: string): Promise<BestDeal | null> {
  return safeQuery("getBestDealById", null as BestDeal | null, async () => {
    const row = await db.bestDeal.findFirst({
      where: { id, ...livePublicWhere() },
      include: {
        partnerAgent: { include: { agency: { select: { name: true } } } },
        suburb: { select: { name: true } },
      },
    });
    return row ? toBestDeal(row) : null;
  });
}

export async function getLiveBestDealCount(): Promise<number> {
  return safeQuery("getLiveBestDealCount", 0, async () => db.bestDeal.count({ where: livePublicWhere() }));
}

// Used by the homepage rail and persona-hub rails. Falls back to recent
// live deals if no contextual match exists, so the rail never renders empty.
export async function getContextualBestDeals(opts: {
  dealType?: DealAudience;
  state?: string;
  limit?: number;
}): Promise<BestDeal[]> {
  const limit = opts.limit ?? 6;
  const matched = await getLiveBestDeals({ dealType: opts.dealType, state: opts.state, limit });
  if (matched.length >= limit) return matched;
  // Top up from recent live deals across any audience/state.
  const filler = await getLiveBestDeals({ limit: limit - matched.length });
  const seen = new Set(matched.map((d) => d.id));
  return [...matched, ...filler.filter((d) => !seen.has(d.id))].slice(0, limit);
}

// Internal helper used by /admin/best-deals — opts in to broader statuses.
export async function listAllDeals(opts: { status?: DealStatus } = {}): Promise<BestDeal[]> {
  const rows = await db.bestDeal.findMany({
    where: opts.status ? { status: opts.status } : undefined,
    include: {
      partnerAgent: { include: { agency: { select: { name: true } } } },
      suburb: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toBestDeal);
}

// Nightly cron flips deals past their expiry to "expired". Called from
// the scheduled function in /api/cron/best-deals/expire (see runbook).
export async function expirePastDueDeals(): Promise<number> {
  const now = new Date();
  const result = await db.bestDeal.updateMany({
    where: { status: "live", expiresAt: { lt: now } },
    data: { status: "expired" },
  });
  return result.count;
}

export function formatBestDealPrice(deal: Pick<BestDeal, "priceText" | "priceMin" | "priceMax">): string {
  if (deal.priceText) return deal.priceText;
  if (deal.priceMin && deal.priceMax) {
    return `$${(deal.priceMin / 1000).toFixed(0)}k – $${(deal.priceMax / 1000).toFixed(0)}k`;
  }
  if (deal.priceMin) return `From $${(deal.priceMin / 1000).toFixed(0)}k`;
  if (deal.priceMax) return `Up to $${(deal.priceMax / 1000).toFixed(0)}k`;
  return "Contact agent";
}
