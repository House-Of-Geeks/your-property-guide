import { db as prisma } from "@/lib/db";

// Who must not be emailed (21 Oct 2026). Suppression is by address, so it
// covers every Lead row with that address (people often sign up twice).
//
//   scope "marketing": unsubscribed from our own emails (the series, the
//     newsletter). Stops marketing only; a guide or plan they ask for
//     still arrives.
//   scope "all": a hard bounce, an invalid address or a spam complaint.
//     Stops everything, including transactional sends.
//
// SendGrid keeps its own suppression lists (bounces, spam reports, global
// unsubscribes) and drops mail to them; we never ask it to bypass them. Its
// events arrive through the webhook and are mirrored here. Our app-level
// unsubscribes are NOT pushed to SendGrid's global list: the account is
// shared by several brands, and a global entry would also block this
// person's transactional email from every one of them.

export type MailCategory = "transactional" | "marketing" | "operational";
export type SuppressionScope = "marketing" | "all";
export type SuppressionReason = "unsubscribe" | "spamreport" | "bounce" | "invalid" | "dropped" | "manual";

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

/** The suppression that stops this category of email to this address, if any. */
export async function activeSuppression(email: string, category: MailCategory) {
  if (category === "operational") return null;
  const scopes: SuppressionScope[] = category === "marketing" ? ["marketing", "all"] : ["all"];
  return prisma.emailSuppression.findFirst({ where: { email: normaliseEmail(email), scope: { in: scopes } } });
}

/** Record a suppression (idempotent: one row per address and scope; a later reason updates it). */
export async function suppress(email: string, scope: SuppressionScope, reason: SuppressionReason, source: "app" | "sendgrid-webhook" | "admin", detail?: string) {
  const addr = normaliseEmail(email);
  await prisma.emailSuppression.upsert({
    where: { email_scope: { email: addr, scope } },
    create: { email: addr, scope, reason, source, detail: detail?.slice(0, 500) },
    update: { reason, source, detail: detail?.slice(0, 500) },
  });
  if (scope === "marketing" || reason === "spamreport" || reason === "unsubscribe") {
    // Every row with this address stops its series and newsletter. The
    // original consent stays on the row as a record; unsubscribedAt is the
    // withdrawal.
    await prisma.lead.updateMany({
      where: { email: { equals: addr, mode: "insensitive" }, unsubscribedAt: null },
      data: { unsubscribedAt: new Date(), sequenceNextAt: null },
    });
  }
}
