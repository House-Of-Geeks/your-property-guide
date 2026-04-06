/**
 * Updates Thomson Property Group agency description with their real bio.
 * Run: npx tsx scripts/seed/update-thomson-bio.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const description = `Thomson, The Family Name you can Trust

We believe that great service stems from understanding our clients' needs, developing a plan to achieve their goals and delivering results with a positive, pro-active attitude. Our philosophy is not just about selling your home or finding the perfect home for you to purchase. It is about providing the most professional service, ensuring your repeat and ongoing referral business.

We are constantly using new and innovative ways to market properties and add value with strategies that present properties to the market in the best possible light. These innovations have proven to work, which is reflected by our clients testimonials.

We only succeed when our clients succeed.`;

async function main() {
  const r = await db.agency.updateMany({
    where: { slug: "thomson-property-group" },
    data: { description },
  });
  console.log(r.count ? "✅ Thomson bio updated" : "⚠️  agency not found");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
