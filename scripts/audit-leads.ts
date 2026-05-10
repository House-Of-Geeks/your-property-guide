// One-shot audit: dump every lead in the DB so we can see what came in
// during the SendGrid outage and what was a test. Run with:
//   npx tsx scripts/audit-leads.ts
// Reads DATABASE_URL from .env automatically via the project's runtime.
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

(async () => {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true, type: true, firstName: true, lastName: true,
      email: true, phone: true, suburb: true, source: true,
      createdAt: true, message: true, propertyId: true, address: true,
      appraisalAddress: true, routedToAgent: true,
    },
  });

  console.log(`TOTAL LEADS IN DB: ${leads.length}\n`);

  for (const l of leads) {
    const isTest =
      /^TEST/i.test(l.firstName) ||
      /Claude/i.test(l.lastName ?? "") ||
      /test|claude/i.test(l.source ?? "");
    const tag = isTest ? "[TEST]" : "[REAL]";
    const created = l.createdAt.toISOString();
    console.log(`${created} | ${l.type.padEnd(22)} | ${tag} | id=${l.id}`);
    console.log(
      `  ${l.firstName} ${l.lastName ?? ""} | ${l.email} | ${l.phone}` +
        (l.suburb ? ` | ${l.suburb}` : "") +
        (l.source ? ` | src=${l.source}` : "")
    );
    if (l.message) console.log(`  msg: ${l.message.slice(0, 120)}`);
    if (l.propertyId) console.log(`  propertyId: ${l.propertyId}`);
    if (l.address) console.log(`  address: ${l.address}`);
    if (l.appraisalAddress) console.log(`  appraisalAddress: ${l.appraisalAddress}`);
    if (l.routedToAgent) console.log(`  routedToAgent: ${l.routedToAgent}`);
    console.log("");
  }

  await db.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
