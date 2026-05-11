/**
 * Updates Thomson Property Group agency record with real website data.
 * Run: npx tsx scripts/seed/update-thomson-agency.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { execSync } from "node:child_process";
import * as path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const result = await db.agency.updateMany({
    where: { slug: "thomson-property-group" },
    data: {
      logo:         "/images/agencies/thomson-property-group.png",
      facebookUrl:  "https://www.facebook.com/ThomsonPropertyGroup/",
      instagramUrl: "https://www.instagram.com/thomsonpropertygroup/",
      youtubeUrl:   "https://www.youtube.com/channel/UC2p_T0ixrxmGz1s_dlZ3Omw",
      linkedinUrl:  "https://www.linkedin.com/company/thomson-property-group",
      heroBg:       "/images/agencies/thomson-hero.jpg",
    },
  });

  if (result.count === 0) {
    console.error("❌ No agency found with slug 'thomson-property-group'");
    process.exit(1);
  }

  console.log(`✅ Updated Thomson Property Group (${result.count} record)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => {
    await db.$disconnect();
    // Verify the write produced renderable URLs. Exits non-zero if any
    // image column references a host that isn't in next.config.ts
    // remotePatterns — the exact bug this script was guilty of in April.
    const auditScript = path.resolve(__dirname, "..", "audit-image-urls.ts");
    execSync(`npx tsx "${auditScript}"`, { stdio: "inherit" });
  });
