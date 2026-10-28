/**
 * Mirror SendGrid's existing suppressions into the site's suppression list
 * (21 Oct 2026). From now on the signed Event Webhook keeps them in step;
 * this catches up the history once.
 *
 *   SENDGRID_API_KEY=… DATABASE_URL=… npx tsx scripts/mail/sync-sendgrid-suppressions.ts          # dry run
 *   SENDGRID_API_KEY=… DATABASE_URL=… npx tsx scripts/mail/sync-sendgrid-suppressions.ts --apply  # write
 *
 * Reads (never writes) SendGrid's bounces, invalid emails, spam reports and
 * global unsubscribes. The account is shared by several brands, so only
 * addresses that appear in this site's Lead table are mirrored. SendGrid
 * drops mail to all of these anyway; mirroring makes the site show it and
 * stop queueing it. Read-only scopes needed: suppression.*.read,
 * asm.suppressions.global.read.
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const apply = process.argv.includes("--apply");
const KEY = process.env.SENDGRID_API_KEY;
if (!KEY) {
  console.error("SENDGRID_API_KEY is not set.");
  process.exit(1);
}

const LISTS = [
  { path: "/v3/suppression/bounces", scope: "all", reason: "bounce" },
  { path: "/v3/suppression/invalid_emails", scope: "all", reason: "invalid" },
  { path: "/v3/suppression/spam_reports", scope: "all", reason: "spamreport" },
  { path: "/v3/suppression/unsubscribes", scope: "all", reason: "unsubscribe" },
] as const;

async function fetchAll(path: string): Promise<string[]> {
  const out: string[] = [];
  for (let offset = 0; offset < 100_000; offset += 500) {
    const res = await fetch(`https://api.sendgrid.com${path}?limit=500&offset=${offset}`, { headers: { Authorization: `Bearer ${KEY}` } });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    const page = (await res.json()) as Array<{ email?: string }>;
    out.push(...page.map((p) => (p.email ?? "").toLowerCase()).filter(Boolean));
    if (page.length < 500) break;
  }
  return out;
}

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const ours = new Set((await prisma.lead.findMany({ select: { email: true }, distinct: ["email"] })).map((l) => l.email.trim().toLowerCase()));
  let host = "(unknown)";
  try {
    host = new URL(process.env.DATABASE_URL ?? "").host;
  } catch {}
  let total = 0;
  for (const list of LISTS) {
    const emails = (await fetchAll(list.path)).filter((e) => ours.has(e));
    console.log(`${list.path}: ${emails.length} of this site's addresses → scope ${list.scope}`);
    total += emails.length;
    if (!apply) continue;
    for (const email of emails) {
      await prisma.emailSuppression.upsert({
        where: { email_scope: { email, scope: list.scope } },
        create: { email, scope: list.scope, reason: list.reason, source: "sendgrid-webhook", detail: `sync from ${list.path}` },
        update: {},
      });
    }
  }
  console.log(`${total} in total. Target: ${host}. ${apply ? "Written." : "Dry run: add --apply to write."}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
