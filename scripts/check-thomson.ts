/**
 * Quick diagnostic: print current DB values for Thomson agency + agents.
 * Run: npx tsx scripts/check-thomson.ts
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const agency = await db.agency.findUnique({
    where: { slug: "thomson-property-group" },
    select: { slug: true, name: true, logo: true, heroBg: true },
  });
  console.log("Agency:", agency);

  const agents = await db.agent.findMany({
    where: { agency: { slug: "thomson-property-group" } },
    select: { slug: true, fullName: true, image: true },
  });
  console.log("\nAgents:");
  for (const a of agents) console.log(`  ${a.slug.padEnd(20)} → ${a.image}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
