/**
 * Updates Thomson agents with real self-hosted photos, and Thomson agency with self-hosted hero.
 * Run: npx tsx scripts/seed/update-thomson-photos.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const updates = [
    { slug: "matthew-thomson", image: "/images/agents/matthew-thomson.jpg" },
    { slug: "dylan-thomson",   image: "/images/agents/dylan-thomson.jpg" },
    { slug: "hannah-thomson",  image: "/images/agents/hannah-thomson.jpg" },
  ];

  for (const { slug, image } of updates) {
    const r = await db.agent.updateMany({ where: { slug }, data: { image } });
    console.log(r.count ? `✅ ${slug}` : `⚠️  not found: ${slug}`);
  }

  // Also update agency hero to self-hosted version
  const agency = await db.agency.updateMany({
    where: { slug: "thomson-property-group" },
    data: { heroBg: "/images/agencies/thomson-hero.jpg" },
  });
  console.log(agency.count ? "✅ Thomson agency heroBg updated" : "⚠️  agency not found");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
