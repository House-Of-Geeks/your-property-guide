/**
 * Updates Thomson Property Group agency record with real website data.
 * Run: npx tsx scripts/seed/update-thomson-agency.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const result = await db.agency.updateMany({
    where: { slug: "thomson-property-group" },
    data: {
      logo:         "https://www.thomsonpropertygroup.com.au/_assets/7958/images/coffs.png",
      facebookUrl:  "https://www.facebook.com/ThomsonPropertyGroup/",
      instagramUrl: "https://www.instagram.com/thomsonpropertygroup/",
      youtubeUrl:   "https://www.youtube.com/channel/UC2p_T0ixrxmGz1s_dlZ3Omw",
      linkedinUrl:  "https://www.linkedin.com/company/thomson-property-group",
      heroBg:       "https://renet.photos/10049013/images/432172/slider1.jpg",
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
  .finally(() => db.$disconnect());
