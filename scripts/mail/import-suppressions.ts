/**
 * Import suppressions from another system's export (21 Oct 2026), so people
 * who unsubscribed, bounced or complained elsewhere are never emailed by the
 * site: e.g. ActiveCampaign's unsubscribed and bounced contacts.
 *
 *   npx tsx scripts/mail/import-suppressions.ts <file.csv> --source=activecampaign            # dry run
 *   npx tsx scripts/mail/import-suppressions.ts <file.csv> --source=activecampaign --apply    # write
 *
 * The CSV needs an "email" column, and optionally "status" or "reason":
 * "bounced", "bounce", "invalid" or "spam"/"complaint" become scope "all";
 * anything else (unsubscribed) becomes scope "marketing". Uses DATABASE_URL
 * and prints which database it will write to before it does.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const [file, ...flags] = process.argv.slice(2);
const apply = flags.includes("--apply");
const source = flags.find((f) => f.startsWith("--source="))?.split("=")[1] ?? "import";
if (!file) {
  console.error("Usage: import-suppressions.ts <file.csv> --source=<name> [--apply]");
  process.exit(1);
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
  const split = (l: string) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  const head = split(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(1).map((l) => Object.fromEntries(split(l).map((v, i) => [head[i], v])));
}

async function main() {
  const rows = parseCsv(readFileSync(file, "utf8"));
  const host = (() => {
    try {
      return new URL(process.env.DATABASE_URL ?? "").host;
    } catch {
      return "(DATABASE_URL not set)";
    }
  })();
  const plan = rows
    .map((r) => {
      const email = (r.email ?? r["email address"] ?? "").trim().toLowerCase();
      const why = `${r.status ?? r.reason ?? ""}`.toLowerCase();
      const all = /bounc|invalid|spam|complain/.test(why);
      return email.includes("@") ? { email, scope: all ? "all" : "marketing", reason: /spam|complain/.test(why) ? "spamreport" : /invalid/.test(why) ? "invalid" : /bounc/.test(why) ? "bounce" : "unsubscribe" } : null;
    })
    .filter((x): x is { email: string; scope: string; reason: string } => x !== null);
  console.log(`${plan.length} suppressions from ${rows.length} rows (${plan.filter((p) => p.scope === "all").length} all, ${plan.filter((p) => p.scope === "marketing").length} marketing). Target: ${host}.`);
  if (!apply) {
    console.log("Dry run. Add --apply to write.");
    return;
  }
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  let written = 0;
  for (const p of plan) {
    await prisma.emailSuppression.upsert({
      where: { email_scope: { email: p.email, scope: p.scope } },
      create: { email: p.email, scope: p.scope, reason: p.reason, source: "admin", detail: `import from ${source}` },
      update: {},
    });
    written++;
  }
  await prisma.$disconnect();
  console.log(`Wrote ${written}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
